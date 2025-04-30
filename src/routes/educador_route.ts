import { type Express } from 'express';
import {
    getEducadores,
    getEducadorById,
    createEducador,
    updateEducador,
    deleteEducador,
} from '../controllers/educador_controller';

function routingEducador(app: Express): void {
    app.get('/api/educadores', getEducadores);
    app.get('/api/educadores/:id', getEducadorById);
    app.post('/api/educadores', createEducador);
    app.put('/api/educadores/:id', updateEducador);
    app.delete('/api/educadores/:id', deleteEducador);
}

export default routingEducador;
