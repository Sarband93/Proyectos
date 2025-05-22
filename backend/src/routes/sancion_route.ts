import { type Express } from 'express';
import {
    getSanciones,
    getSancionById,
    createSancion,
    updateSancion,
    deleteSancion,
} from '../controllers/sancion_controller';

import { Auth } from '../middlewares/Auth';
import { Role } from '../middlewares/Role';

function routingSancion(app: Express): void {
    // Ver todas las sanciones o filtrar por menor
    app.get('/api/sanciones', Auth, getSanciones);

    // Ver sanción por ID
    app.get('/api/sanciones/:id', Auth, getSancionById);

    // Crear nueva sanción
    app.post('/api/sanciones', Auth, createSancion);

    // Actualizar sanción
    app.put('/api/sanciones/:id', Auth, updateSancion);

    // Eliminar sanción (o marcarla como inactiva si cambias la lógica)
    app.delete('/api/sanciones/:id', Auth, Role('coordinador'), deleteSancion);
}

export default routingSancion;
