import { type Express } from 'express';
import {
    getHabitaciones,
    getHabitacionById,
    updateHabitacion,
} from '../controllers/habitacion_controller';

import { Auth } from '../middlewares/Auth';
import { Role } from '../middlewares/Role';

function routingHabitacion(app: Express): void {
    // GET HABITACIONES
    app.get('/api/habitaciones/', Auth, getHabitaciones);
    // GET HABITACION POR ID
    app.get('/api/habitaciones/:id', Auth, getHabitacionById);
    // PUT HABITACION
    app.put('/api/habitaciones/:id', Auth, updateHabitacion);
}

export default routingHabitacion;
