import HttpError from './HttpError';
import HttpCodes from '../HttpCodes';

export default class UnauthorizedError extends HttpError {
    constructor(message?: string) {
        super(HttpCodes.UNAUTHORIZED, message || 'No autorizado');
    }
}
