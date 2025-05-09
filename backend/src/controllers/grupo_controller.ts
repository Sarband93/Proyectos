import { Request, Response, NextFunction } from 'express';
import { Grupo } from '../models/grupo_model';
import BadRequestError from '../server/errors/BadRequestError';
import NotFoundError from '../server/errors/NotFoundError';

// Obtener todos los grupos
export const getGrupos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const grupos = await Grupo.find()
            .populate('habitaciones', 'identificador') // Solo traemos el identificador de la habitación
            .populate('menores', 'nombre apellidos') // Solo traemos nombre y apellidos de los menores
            .populate('educadorManana', 'nombre apellidos')
            .populate('educadorTarde', 'nombre apellidos')
            .populate('educadorFinde', 'nombre apellidos');

        res.json(grupos);
    } catch (error) {
        next(error);
    }
};

// Obtener un grupo por ID
import { Menor } from '../models/menor_model';

export const getGrupoById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const grupo = await Grupo.findById(req.params.id)
            .populate({
                path: 'habitaciones',
                select: 'identificador menores',
                populate: {
                    path: 'menores',
                    select: 'nombre apellidos'
                }
            })
            .populate('educadorManana', 'nombre apellidos _id')
            .populate('educadorTarde', 'nombre apellidos _id')
            .populate('educadorFinde', 'nombre apellidos _id')


        if (!grupo) throw new NotFoundError('Grupo no encontrado');

        const menores = await Menor.find({ grupoId: grupo._id }, 'nombre apellidos _id');

        const grupoConMenores = {
            ...grupo.toObject(),
            menores,
        };

        res.json(grupoConMenores);
    } catch (error) {
        next(error);
    }
};



// Actualizar un grupo
export const updateGrupo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const grupoActualizado = await Grupo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        )
            .populate('habitaciones', 'identificador')
            .populate('menores', 'nombre apellidos')
            .populate('educadorManana', 'nombre apellidos')
            .populate('educadorTarde', 'nombre apellidos')
            .populate('educadorFinde', 'nombre apellidos');

        if (!grupoActualizado) throw new NotFoundError('Grupo no encontrado');

        res.json(grupoActualizado);
    } catch (error) {
        next(new BadRequestError('Error al actualizar el grupo'));
    }
};
