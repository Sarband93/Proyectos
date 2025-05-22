import HttpError from './HttpError';
import HttpCodes from '../HttpCodes';

export default class ForbiddenError extends HttpError {
    constructor(message?: string) {
        super(HttpCodes.FORBIDDEN, message || 'Acceso denegado');
    }
}
