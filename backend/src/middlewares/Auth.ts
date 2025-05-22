import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../server/errors/UnauthorizedError';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: 'educador' | 'coordinador';
    };
}

export const Auth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string;
            role: 'educador' | 'coordinador';
        };

        req.user = decoded;
        next();
    } catch (error) {
        throw new UnauthorizedError('Token inválido o expirado');
    }
};
