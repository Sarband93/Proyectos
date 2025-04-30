import { type Express } from 'express';
import {
    getSanciones,
    getSancionById,
    createSancion,
    updateSancion,
    deleteSancion,
} from '../controllers/sancion_controller';

function routingSancion(app: Express): void {
    // Ver todas las sanciones o filtrar por menor
    app.get('/api/sanciones', getSanciones);

    // Ver sanción por ID
    app.get('/api/sanciones/:id', getSancionById);

    // Crear nueva sanción
    app.post('/api/sanciones', createSancion);

    // Actualizar sanción
    app.put('/api/sanciones/:id', updateSancion);

    // Eliminar sanción (o marcarla como inactiva si cambias la lógica)
    app.delete('/api/sanciones/:id', deleteSancion);
}

export default routingSancion;
