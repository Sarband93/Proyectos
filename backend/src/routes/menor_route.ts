import { type Express } from 'express';
import {
    getMenores,
    getMenorById,
    createMenor,
    updateMenor,
    deleteMenor,
    buscarMenores,
} from '../controllers/menor_controller';

function routingMenor(app: Express): void {
    // GET MENORES
    app.get('/api/menores', getMenores);
    // POST MENOR
    app.post('/api/menores', createMenor);
    // GET MENOR POR ID
    app.get('/api/menores/:id', getMenorById);
    //PUT MENOR
    app.put('/api/menores/:id', updateMenor);
    //DELETE MENOR
    app.delete('/api/menores/:id', deleteMenor);
    //GET MENORES POR FILTRO
    app.get('/api/menores/buscar', buscarMenores);
}

export default routingMenor;
