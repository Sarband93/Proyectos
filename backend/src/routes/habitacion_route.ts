import { type Express } from 'express';
import {
    getHabitaciones,
    getHabitacionById,
    updateHabitacion,
} from '../controllers/habitacion_controller';

function routingHabitacion(app: Express): void {
    // GET HABITACIONES
    app.get('/api/habitaciones/', getHabitaciones);
    // GET HABITACION POR ID
    app.get('/api/habitaciones/:id', getHabitacionById);
    // PUT HABITACION
    app.put('/api/habitaciones/:id', updateHabitacion);
}

export default routingHabitacion;
