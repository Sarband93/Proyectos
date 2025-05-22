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
        if (!usuario.isActive) {
            throw new BadRequestError('El usuario debe ser validado por un coordinador');
        }
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) throw new BadRequestError('Contraseña incorrecta');

        const expiresIn = 60 * 60;
        const token = jwt.sign(
            { id: usuario._id, role: usuario.role },
            process.env.JWT_SECRET as string,
            { expiresIn: expiresIn }
        );

        res.json({
            token,
            usuario: {
                id: usuario._id,
                name: usuario.name,
                surname: usuario.surname,
                email: usuario.email,
                role: usuario.role,
                expires: Date.now() + expiresIn * 1000
            },
        });
    } catch (error) {
        next(error);
    }
};

export const crearUsuario = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, surname, nickName, email, password } = req.body;

        const existe = await Usuario.findOne({ email });
        if (existe) throw new BadRequestError('El email ya está en uso');

        const nuevo = new Usuario({
            name,
            surname,
            nickName,
            email,
            password,
            role: 'educador'  
        });

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

