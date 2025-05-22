import { type Express } from 'express';
import {
    getGrupos,
    getGrupoById,
    updateGrupo,
    createGrupo,
    deleteGrupo,
} from '../controllers/grupo_controller';

import { Auth } from '../middlewares/Auth';
import { Role } from '../middlewares/Role';

function routingGrupo(app: Express): void {
    // GET GRUPOS
    app.get('/api/grupos/', Auth, getGrupos);
    // GET GRUPOS POR ID
    app.get('/api/grupos/:id', Auth, getGrupoById);
    // PUT GRUPO
    app.put('/api/grupos/:id', Auth, Role('coordinador'), updateGrupo);
    // POST GRUPOS
    app.post('/api/grupos', Auth, Role('coordinador'), createGrupo);
    // DELETE GRUPOS
    app.delete('/api/grupos/:id', Auth, Role('coordinador'), deleteGrupo);
}

export default routingGrupo;
