import { Request, Response, NextFunction } from 'express';
import { Habitacion } from '../models/habitacion_model';
import BadRequestError from '../server/errors/BadRequestError';
import NotFoundError from '../server/errors/NotFoundError';

export const getHabitaciones = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const habitaciones = await Habitacion.find().populate({
            path: 'menores',
            select: 'nombre apellidos',
        }); // Con populate a parte de los id de las habitaciones, te da la informacion del menor. Con path y select seleccione que de los menores solo me de nombre y apellidos.
        res.json(habitaciones);
    } catch (error) {
        next(error);
    }
};

export const getHabitacionById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const habitacion = await Habitacion.findById(req.params.id).populate({
            path: 'menores',
            select: 'nombre apellidos',
        });
        if (!habitacion) throw new NotFoundError('Habitación no encontrada');
        res.json(habitacion);
    } catch (error) {
        next(error);
    }
};

export const updateHabitacion = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const actualizada = await Habitacion.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        ).populate('menores');

        if (!actualizada) throw new NotFoundError('Habitación no encontrada');
        res.json(actualizada);
    } catch (error) {
        next(new BadRequestError('Error al actualizar la habitación'));
    }
};
