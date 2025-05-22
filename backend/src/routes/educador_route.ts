import { type Express } from 'express';
import {
    getEducadores,
    getEducadorById,
    createEducador,
    updateEducador,
    deleteEducador,
} from '../controllers/educador_controller';

import { Auth } from '../middlewares/Auth';
import { Role } from '../middlewares/Role';

function routingEducador(app: Express): void {
    app.get('/api/educadores', Auth, getEducadores);
    app.get('/api/educadores/:id', Auth, getEducadorById);
    app.post('/api/educadores', Auth, Role('coordinador'), createEducador);
    app.put('/api/educadores/:id', Auth, Role('coordinador'), updateEducador);
    app.delete('/api/educadores/:id', Auth, Role('coordinador'), deleteEducador);
}

export default routingEducador;
