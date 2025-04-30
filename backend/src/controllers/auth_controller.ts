import { Request, Response, NextFunction } from 'express';
import { Usuario } from '../models/usuario_model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import BadRequestError from '../server/errors/BadRequestError';

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });

        if (!usuario) throw new BadRequestError('Usuario no encontrado');

        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) throw new BadRequestError('Contraseña incorrecta');

        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        next(error);
    }
};

// CREAR USUARIO
export const crearUsuario = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const existe = await Usuario.findOne({ email });
        if (existe) throw new BadRequestError('El email ya está en uso');

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevo = new Usuario({
            nombre,
            email,
            password: hashedPassword,
            rol,
        });

        const guardado = await nuevo.save();
        res.status(201).json({
            message: 'Usuario creado',
            usuario: guardado,
        });
    } catch (error) {
        next(error);
    }
};
