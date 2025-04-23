import { Request, Response, NextFunction } from 'express';
import { Menor } from '../models/menor_model';
import { Types } from 'mongoose';
// Errors Imports
import BadRequestError from '../server/errors/BadRequestError';
import NotFoundError from '../server/errors/NotFoundError';

async function getMenor(req: Request, res: Response, next: NextFunction) {
    try {
        throw new Error('error de prueba');
        res.status(200).json({
            message: 'Endpoint funcionando correctamente',
        });
    } catch (error) {
        next(error);
        console.log(error);
    }
}

async function postMenor(req: Request, res: Response, next: NextFunction) {
    {
        try {
            const { nombre, apellido, edad, grupo } = req.body;

            const menor = new Menor({ nombre, apellido, edad, grupo });
            const menorGuardado = await menor.save();

            res.status(200).json({
                message: 'El chaval ha sido guardado correctamente',
                menor: menorGuardado,
            });
        } catch (error) {
            console.log(error);
            next(error);
            // res.status(500).json({
            //     mensaje: 'Error al guardar el chaval'
            // })
        }
    }
}

async function getListaMenores(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const menores = await Menor.find();

        res.json({
            message: 'Lista de menores correcta',
            menores,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function buscarMenorPorGrupo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { nombreGrupo } = req.params;

        const menores = await Menor.find({ grupo: nombreGrupo });

        res.status(200).json({
            message: `Menores del grupo ${nombreGrupo}`,
            menores,
        });
    } catch (error) {
        next(error);
    }
}

export async function buscarMenorPorApellido(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { apellido } = req.params;

        const menores = await Menor.find({ apellido });

        res.status(200).json({
            message: `Menores con apellido ${apellido}`,
            menores,
        });
    } catch (error) {
        next(error);
    }
}

export async function modificarMenor(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { id } = req.params;
        const { nombre, apellido, edad, grupo } = req.body;

        // Comprueba si el ID es valido
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID no válido');
        }

        // Busca y actualiza el menor
        const menorActualizado = await Menor.findByIdAndUpdate(
            id,
            { nombre, apellido, edad, grupo },
            { new: true } // Devuelve el objeto actualizado
        );

        if (!menorActualizado) {
            throw new NotFoundError('Menor no encontrado');
        }

        res.status(200).json({
            message: 'Menor actualizado correctamente',
            menor: menorActualizado,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

// Insertar varios menores a la bd
export async function insertarVariosMenores(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const listaMenores = req.body;

        // if (!Array.isArray(listaMenores)) {
        //     res.status(400).json({ message: 'Debes insertar varios menores'})
        //     return
        // }
        if (!Array.isArray(listaMenores)) {
            throw new BadRequestError('Debes insertar varios menores');
        }

        const resultado = await Menor.insertMany(listaMenores);

        // res.status(200).json({
        res.json({
            message: 'menores insertados correctamente',
            menores: resultado,
        });
    } catch (error) {
        next(error);
    }
}

export default {
    getMenor,
    postMenor,
    getListaMenores,
    buscarMenorPorGrupo,
    buscarMenorPorApellido,
    modificarMenor,
    insertarVariosMenores,
};
