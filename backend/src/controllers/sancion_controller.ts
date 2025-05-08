import { Request, Response, NextFunction } from 'express'
import { Sancion } from '../models/sancion_model'
import NotFoundError from '../server/errors/NotFoundError'
import BadRequestError from '../server/errors/BadRequestError'

// Obtener todas las sanciones (opcionalmente filtradas por menorId o activa/inactiva)
export const getSanciones = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { menorId, incluirInactivas } = req.query

    const filtro: Record<string, unknown> = {}

    if (menorId) filtro.menorId = menorId
    if (!incluirInactivas || incluirInactivas === 'false') filtro.activa = true

    const sanciones = await Sancion.find(filtro)
      .populate('menorId', 'nombre apellidos')
      .populate('educadorId', 'nombre apellidos')

    res.json(sanciones)
  } catch (error) {
    next(error)
  }
}

// Obtener sanción por ID
export const getSancionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sancion = await Sancion.findById(req.params.id)
      .populate('menorId', 'nombre apellidos')
      .populate('educadorId', 'nombre apellidos')

    if (!sancion) throw new NotFoundError('Sanción no encontrada')
    res.json(sancion)
  } catch (error) {
    next(error)
  }
}

// Crear nueva sanción
export const createSancion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const nueva = new Sancion(req.body)
    const guardada = await nueva.save()
    res.status(201).json(guardada)
  } catch (error) {
    next(new BadRequestError('Error al crear la sanción'))
  }
}

// Actualizar sanción
export const updateSancion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const actualizada = await Sancion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!actualizada) throw new NotFoundError('Sanción no encontrada')
    res.json(actualizada)
  } catch (error) {
    next(error)
  }
}

// Desactivar sanción (marcar como inactiva y guardar fecha de desactivación)
export const deleteSancion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sancion = await Sancion.findByIdAndUpdate(
      req.params.id,
      { activa: false, fechaDesactivacion: new Date() },
      { new: true }
    )

    if (!sancion) throw new NotFoundError('Sanción no encontrada')

    res.json({
      message: 'Sanción desactivada correctamente',
      sancion,
    })
  } catch (error) {
    next(error)
  }
}
