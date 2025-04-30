import { Request, Response, NextFunction } from 'express';
import { Menor } from '../models/menor_model';
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
        const menores = await Menor.find();
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
        const menor = await Menor.findById(req.params.id);
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
        const menorActualizado = await Menor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!menorActualizado) throw new NotFoundError('Menor no encontrado');
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
        const menorEliminado = await Menor.findByIdAndDelete(req.params.id);
        if (!menorEliminado) throw new NotFoundError('Menor no encontrado');
        res.json({ message: 'Menor eliminado correctamente ' });
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
                $regrex: new RegExp(apellidos as string, 'i'),
            };
        if (tutelado) filtro.tutelado = tutelado === 'true';

        const resultados = await Menor.find(filtro);
        res.json(resultados);
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
