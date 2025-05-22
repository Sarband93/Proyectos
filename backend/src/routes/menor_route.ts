import { type Express } from 'express';
import {
    getMenores,
    getMenorById,
    createMenor,
    updateMenor,
    deleteMenor,
    buscarMenores,
    liberarHabitacionMenor,
} from '../controllers/menor_controller';

import { Auth } from '../middlewares/Auth';
import { Role } from '../middlewares/Role';

function routingMenor(app: Express): void {
    // GET MENORES
    app.get('/api/menores', Auth, getMenores);
    // POST MENOR
    app.post('/api/menores', Auth, createMenor);
    // GET MENOR POR ID
    app.get('/api/menores/:id', Auth, getMenorById);
    //PUT MENOR
    app.put('/api/menores/:id', Auth, updateMenor);
    //DELETE MENOR
    app.delete('/api/menores/:id', Auth, Role('coordinador'), deleteMenor);
    //GET MENORES POR FILTRO
    app.get('/api/menores/buscar', Auth, buscarMenores);
    //PUT LIBERAR HABITACION
    app.put('/api/menores/liberar-habitacion/:id', Auth, liberarHabitacionMenor);

}

export default routingMenor;
