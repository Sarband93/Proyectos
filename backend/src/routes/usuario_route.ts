// routes/routingUsuario.ts
import { type Express } from 'express';
import {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    editarPerfil,
    activarUsuario,
    desactivarUsuario,
    getUsuarioById,
} from '../controllers/usuario_controller';

import { Auth } from '../middlewares/Auth';
import { Role } from '../middlewares/Role';

function routingUsuario(app: Express): void {
    app.get('/api/usuarios', Auth, Role('coordinador'), getUsuarios);
    app.get('/api/usuarios/:id', Auth, Role('coordinador'), getUsuarioById);
    app.post('/api/usuarios', Auth, Role('coordinador'), createUsuario);
    app.put('/api/usuarios/:id', Auth, Role('coordinador'), updateUsuario);
    app.delete('/api/usuarios/:id', Auth, Role('coordinador'), deleteUsuario);

    app.put('/api/usuarios/activar/:email', Auth, Role('coordinador'), activarUsuario);
    app.put('/api/usuarios/desactivar/:email', Auth, Role('coordinador'), desactivarUsuario);

    app.put('/api/usuarios/perfil', Auth, editarPerfil);
}

export default routingUsuario;
