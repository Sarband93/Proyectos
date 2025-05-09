import { Request, Response, NextFunction } from 'express';
import { Educador } from '../models/educador_model';
import { Grupo } from '../models/grupo_model';
import NotFoundError from '../server/errors/NotFoundError';
import BadRequestError from '../server/errors/BadRequestError';

// Obtener todos los educadores
export const getEducadores = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const educadores = await Educador.find().populate({
            path: 'grupoAsignado',
            select: 'nombre',
        });

        res.json(educadores);
    } catch (error) {
        next(error);
    }
};

// Obtener educador por ID
export const getEducadorById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const educador = await Educador.findById(req.params.id).populate({
            path: 'grupoAsignado',
            select: 'nombre apellidos',
        });

        if (!educador) throw new NotFoundError('Educador no encontrado');
        res.json(educador);
    } catch (error) {
        next(error);
    }
};

// Crear nuevo educador
export const createEducador = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const nuevo = new Educador(req.body);
        const guardado = await nuevo.save();
        res.status(201).json(guardado);
    } catch (error) {
        next(new BadRequestError('Error al crear educador'));
    }
};

// Actualizar educador
export const updateEducador = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const actualizado = await Educador.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        ).populate({ path: 'grupoAsignado', select: 'nombre apellidos' });

        if (!actualizado) throw new NotFoundError('Educador no encontrado');
        res.json(actualizado);
    } catch (error) {
        next(error);
    }
};

// Eliminar educador
export const deleteEducador = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const eliminado = await Educador.findByIdAndDelete(req.params.id);
        if (!eliminado) throw new NotFoundError('Educador no encontrado');
        res.json({ message: 'Educador eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};

// Buscar educadores por turno o grupoAsignado
// export const buscarEducadores = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const { turno, grupo } = req.query;
//         const filtro: Record<string, unknown> = {};

//         if (turno) {
//             filtro.turno = turno;
//         }

//         if (grupo) {
//             // Buscar el grupo por nombre y extraer su ID
//             const grupoDoc = await Grupo.findOne({ nombre: grupo });
//             if (!grupoDoc) {
//                 return res.status(404).json({
//                     error: 1,
//                     message: `Grupo "${grupo}" no encontrado`,
//                 });
//             }
//             filtro.grupoAsignado = grupoDoc._id;
//         }

//         const educadores = await Educador.find(filtro).populate({
//             path: 'grupoAsignado',
//             select: 'nombre',
//         });

//         res.json(educadores);
//     } catch (error) {
//         next(error);
//     }
// };
