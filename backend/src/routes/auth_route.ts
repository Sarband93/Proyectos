import { type Express } from 'express';
import { login, crearUsuario } from '../controllers/auth_controller';

function routingAuth(app: Express): void {
    // LOGIN
    app.post('/api/auth/login', login);
    // CREAR USUARIO
    app.post('/api/auth/register', crearUsuario);
}

export default routingAuth;
