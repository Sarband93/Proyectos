// controllers/usuario_controller.ts
import { Request, Response, NextFunction } from 'express';
import { Usuario } from '../models/usuario_model';
import BadRequestError from '../server/errors/BadRequestError';
import NotFoundError from '../server/errors/NotFoundError';
import { AuthenticatedRequest } from '../middlewares/Auth';

export const getUsuarios = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarios = await Usuario.find({}, '-password'); // sin contraseñas
        res.json(usuarios);
    } catch (error) {
        next(error);
    }
};

export const createUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, surname, email, password, role } = req.body;

        const existente = await Usuario.findOne({ email });
        if (existente) throw new BadRequestError('Ya existe un usuario con ese email');

        const nuevo = new Usuario({ name, surname, email, password, role: 'educador' });
        const guardado = await nuevo.save();

        res.status(201).json({
            message: 'Usuario creado correctamente',
            usuario: {
                id: guardado._id,
                name: guardado.name,
                surname: guardado.surname,
                email: guardado.email,
                role: guardado.role
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, surname, password, role } = req.body;

        const usuario = await Usuario.findById(id);
        if (!usuario) throw new NotFoundError('Usuario no encontrado');

        usuario.name = name ?? usuario.name;
        usuario.surname = surname ?? usuario.surname;
        usuario.role = role ?? usuario.role;
        if (password) usuario.password = password; // se rehashea por el pre('save')

        await usuario.save();

        res.json({
            message: 'Usuario actualizado correctamente',
            usuario: {
                id: usuario._id,
                name: usuario.name,
                surname: usuario.surname,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const eliminado = await Usuario.findByIdAndDelete(id);
        if (!eliminado) throw new NotFoundError('Usuario no encontrado');

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};

export const activarUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) throw new NotFoundError('Usuario no encontrado');

        usuario.isActive = true;
        await usuario.save();

        res.json({ message: 'Usuario activado correctamente' });
    } catch (error) {
        next(error);
    }
};

export const desactivarUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) throw new NotFoundError('Usuario no encontrado');

        usuario.isActive = false;
        await usuario.save();

        res.json({ message: 'Usuario desactivado correctamente' });
    } catch (error) {
        next(error);
    }
};

export const getUsuarioById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findById(id, '-password');
        if (!usuario) throw new NotFoundError('Usuario no encontrado');

        res.json(usuario);
    } catch (error) {
        next(error);
    }
};


export const editarPerfil = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { name, surname, password, password2 } = req.body;

    if (!userId) throw new BadRequestError('Usuario no autenticado');

    const usuario = await Usuario.findById(userId);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    usuario.name = name ?? usuario.name;
    usuario.surname = surname ?? usuario.surname;

    // Validación si el usuario quiere cambiar la contraseña
    if (password || password2) {
      if (password !== password2) {
        throw new BadRequestError('Las contraseñas no coinciden');
      }

      usuario.password = password; // Se rehashea en pre('save')
    }

    await usuario.save();

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    next(error);
  }
};

