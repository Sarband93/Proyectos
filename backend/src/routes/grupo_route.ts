import { type Express } from 'express';
import {
    getGrupos,
    getGrupoById,
    updateGrupo,
} from '../controllers/grupo_controller';

function routingGrupo(app: Express): void {
    // GET GRUPOS
    app.get('/api/grupos/', getGrupos);
    // GET GRUPOS POR ID
    app.get('/api/grupos/:id', getGrupoById);
    // PUT GRUPO
    app.put('/api/grupos/:id', updateGrupo);
}

export default routingGrupo;
