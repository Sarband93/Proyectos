import { Request, Response, NextFunction } from 'express';
import { Menor } from '../models/menor_model';
import { Habitacion } from '../models/habitacion_model';
import { Types } from 'mongoose';
// Errors Imports
import BadRequestError from '../server/errors/BadRequestError';
import NotFoundError from '../server/errors/NotFoundError';
import { error } from 'console';

// Obtener todos los menores
export const getMenores = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const menores = await Menor.find().populate('grupoId', 'nombre');
        res.json(menores);
    } catch (error) {
        next(error);
    }
};

// Obtener un menor por ID
export const getMenorById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const menor = await Menor.findById(req.params.id)
            .populate('grupoId', 'nombre')
            .populate('habitacionId', 'identificador');
                
        if (!menor) throw new NotFoundError('Menor no encontrado');
        res.json(menor);
    } catch (error) {
        next(error);
    }
};

// Crear un nuevo menor
export const createMenor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const nuevoMenor = new Menor(req.body);
        const guardado = await nuevoMenor.save();
        res.status(201).json(guardado);
    } catch (error) {
        next(new BadRequestError('Error al crear el menor'));
    }
};

// Actualizar menor
export const updateMenor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Procesar fecha de sanción
        if (
            req.body.estado?.enSeparacionGrupo &&
            req.body.estado.fechaFinSeparacionGrupo &&
            req.body.estado.horaFinSeparacionGrupo
        ) {
            const fechaCompleta = new Date(
                `${req.body.estado.fechaFinSeparacionGrupo}T${req.body.estado.horaFinSeparacionGrupo}:00`
            );
            req.body.estado.fechaFinSeparacionCompleta = fechaCompleta;

            delete req.body.estado.fechaFinSeparacionGrupo;
            delete req.body.estado.horaFinSeparacionGrupo;
        }

        const habitacionId = req.body.habitacionId;

        // Obtener menor antes de actualizar para saber su habitación anterior
        const menorAntes = await Menor.findById(req.params.id);
        if (!menorAntes) throw new NotFoundError('Menor no encontrado');

        // Verificar habitación nueva
        if (habitacionId) {
            const habitacionNueva = await Habitacion.findById(habitacionId);
            if (!habitacionNueva) {
                throw new BadRequestError('La habitación seleccionada no existe');
            }

            const esDoble = habitacionNueva.tipo === 'doble';
            const numOcupantes = habitacionNueva.menores.length;

            if (!esDoble && numOcupantes >= 1) {
                throw new BadRequestError('La habitación individual ya está ocupada');
            }

            if (esDoble && numOcupantes >= 2) {
                throw new BadRequestError('La habitación doble ya está completa');
            }
        }

        // Actualizar menor
        const menorActualizado = await Menor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!menorActualizado) throw new NotFoundError('Menor no encontrado');

        // Si tenía una habitación anterior y ha cambiado, limpiarla
        const habitacionAnteriorId = menorAntes.habitacionId?.toString();
        if (habitacionAnteriorId && habitacionAnteriorId !== habitacionId) {
            const habitacionAnterior = await Habitacion.findById(habitacionAnteriorId);
            if (habitacionAnterior) {
                habitacionAnterior.menores = habitacionAnterior.menores.filter(
                    (id) => id.toString() !== menorAntes._id.toString()
                );

                // Si queda vacía, la marcamos como limpia
                habitacionAnterior.estado =
                    habitacionAnterior.menores.length === 0
                        ? 'vacía y limpia'
                        : 'ocupada';

                await habitacionAnterior.save();
            }
        }

        // Añadir al menor a la nueva habitación (si no estaba)
        if (habitacionId) {
            const habitacionNueva = await Habitacion.findById(habitacionId);
            if (habitacionNueva) {
                const yaAsignado = habitacionNueva.menores.some(
                    (id) => id.toString() === menorActualizado._id.toString()
                );

                if (!yaAsignado) {
                    habitacionNueva.menores.push(menorActualizado._id);
                }

                habitacionNueva.estado = 'ocupada';
                await habitacionNueva.save();
            }
        }

        res.json(menorActualizado);
    } catch (error) {
        next(error);
    }
};


// Eliminar menor
export const deleteMenor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const menor = await Menor.findById(req.params.id);
        if (!menor) throw new NotFoundError('Menor no encontrado');

        // Si tenía habitación, limpiarla
        if (menor.habitacionId) {
            const habitacion = await Habitacion.findById(menor.habitacionId);
            if (habitacion) {
                // Quitar al menor de la lista
                habitacion.menores = habitacion.menores.filter(
                    (id) => id.toString() !== menor._id.toString()
                );

                // Si ya no hay menores, marcar como vacía
                habitacion.estado =
                    habitacion.menores.length === 0 ? 'vacía y limpia' : 'ocupada';

                await habitacion.save();
            }
        }

        // Eliminar al menor
        await Menor.findByIdAndDelete(req.params.id);

        res.json({ message: 'Menor eliminado correctamente y habitación actualizada' });
    } catch (error) {
        next(error);
    }
};

// Buscar menor por Grupo, apellidos o tutelado
export const buscarMenores = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { grupo, tutelado, apellidos } = req.query;

        const filtro: Record<string, unknown> = {}; //

        if (grupo) filtro.grupoId = grupo;
        if (apellidos)
            filtro.apellidos = {
                $regex: new RegExp(apellidos as string, 'i'),
            };
        if (tutelado) filtro.tutelado = tutelado === 'true';

        const resultados = await Menor.find(filtro);
        res.json(resultados);
    } catch (error) {
        next(error);
    }
};

export const liberarHabitacionMenor = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const menor = await Menor.findById(req.params.id);
        if (!menor) throw new NotFoundError('Menor no encontrado');

        if (!menor.habitacionId) {
            res.json({ message: 'El menor no tiene habitación asignada' });
            return;
        }

        const habitacion = await Habitacion.findById(menor.habitacionId);
        if (habitacion) {
            habitacion.menores = habitacion.menores.filter(
                (id) => id.toString() !== menor._id.toString()
            );
            habitacion.estado =
                habitacion.menores.length === 0 ? 'vacía y limpia' : 'ocupada';
            await habitacion.save();
        }

        menor.habitacionId = undefined;
        await menor.save();

        res.json({ message: 'Habitación liberada correctamente' });
    } catch (error) {
        next(error);
    }
};


// // Insertar varios menores a la bd
// export async function insertarVariosMenores(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> {
//     try {
//         const listaMenores = req.body;

//         // if (!Array.isArray(listaMenores)) {
//         //     res.status(400).json({ message: 'Debes insertar varios menores'})
//         //     return
//         // }
//         if (!Array.isArray(listaMenores)) {
//             throw new BadRequestError('Debes insertar varios menores');
//         }

//         const resultado = await Menor.insertMany(listaMenores);

//         // res.status(200).json({
//         res.json({
//             message: 'menores insertados correctamente',
//             menores: resultado,
//         });
//     } catch (error) {
//         next(error);
//     }
