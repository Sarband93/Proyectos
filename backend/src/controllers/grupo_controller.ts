import { Request, Response, NextFunction } from 'express';
import { Grupo } from '../models/grupo_model';
import BadRequestError from '../server/errors/BadRequestError';
import NotFoundError from '../server/errors/NotFoundError';

// Obtener todos los grupos
// Obtener todos los grupos con habitaciones y menores
export const getGrupos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const grupos = await Grupo.find()
            .populate({
                path: 'habitaciones',
                populate: {
                    path: 'menores',
                    select: 'nombre apellidos tutelado protocolosSeguridad salud medicaciones estado apoyoEducativo protocolosEspeciales',
                    populate: {
                        path: 'sancionesActivas',
                        select: 'tipo fechaFin activa',
                    }
                }
            })
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

// Crear grupo
import { Habitacion } from '../models/habitacion_model';

export const createGrupo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nombre, descripcion, capacidad } = req.body;

    // 1. Crear el grupo inicialmente sin habitaciones
    const grupo = new Grupo({ nombre, descripcion });
    const grupoGuardado = await grupo.save();

    // 2. Crear habitaciones en base a la capacidad (asumimos 9 por defecto si no hay capacidad)
    const total = capacidad ?? 9;
    const habitaciones = [];

    for (let i = 1; i <= total; i++) {
      const tipo = i === 4 || i === 8 ? 'doble' : 'individual';
      const identificador = `H${i}`;

      const nuevaHabitacion = new Habitacion({
        identificador,
        grupoId: grupoGuardado._id,
        tipo,
        estado: 'vacía y limpia',
        menores: [],
      });

      await nuevaHabitacion.save();
      habitaciones.push(nuevaHabitacion._id);
    }

    // 3. Asociar habitaciones al grupo y guardar
    grupoGuardado.habitaciones = habitaciones;
    await grupoGuardado.save();

    // 4. Devolver grupo completo
    const grupoCompleto = await Grupo.findById(grupoGuardado._id)
      .populate('habitaciones', 'identificador tipo estado')
      .populate('educadorManana', 'nombre apellidos')
      .populate('educadorTarde', 'nombre apellidos')
      .populate('educadorFinde', 'nombre apellidos');

    res.status(201).json(grupoCompleto);
  } catch (error) {
    next(new BadRequestError('Error al crear el grupo'));
  }
};

// ELIMINAR GRUPO
export const deleteGrupo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) throw new NotFoundError('Grupo no encontrado');

    // 1. Eliminar todas las habitaciones asociadas a ese grupo
    await Habitacion.deleteMany({ grupoId: grupo._id });

    // 2. Eliminar el grupo en sí
    await Grupo.findByIdAndDelete(grupo._id);

    res.json({ message: 'Grupo eliminado correctamente' });
  } catch (error) {
    next(new BadRequestError('Error al eliminar el grupo'));
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
