import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './Auth';
import ForbiddenError from '../server/errors/ForbiddenError';

export const Role = (role: 'educador' | 'coordinador') => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            throw new ForbiddenError('No tienes permiso para realizar esta acción');
        }

        next();
    };
};
