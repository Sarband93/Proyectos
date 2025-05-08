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
      const data = req.body;
  
      if (!Array.isArray(data.menores)) {
        throw new BadRequestError('Debes enviar un array de IDs en el campo "menores".');
      }
  
      const estado = data.menores.length > 0 ? 'ocupada' : 'vacía y limpia';
  
      const actualizada = await Habitacion.findByIdAndUpdate(
        req.params.id,
        {
          ...data,
          estado,
        },
        { new: true }
      ).populate({
        path: 'menores',
        select: 'nombre apellidos',
      });
  
      if (!actualizada) throw new NotFoundError('Habitación no encontrada');
  
      res.json(actualizada);
    } catch (error) {
      next(error);
    }
  };
  
