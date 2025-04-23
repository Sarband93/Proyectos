import { type Express } from 'express'
import menor_controller from '../controllers/menor_controller'

function routing(app: Express): void {
    // GET CONTROLLER ROUTE
    app.get('/get-menor', menor_controller.getMenor)
    // POST CONTROLLER ROUTE
    app.post('/post-menor', menor_controller.postMenor)

    // GET LISTA MENORES
    app.get('/menores', menor_controller.getListaMenores)

    // GET LISTA MENORES POR GRUPO
    app.get('/menores/grupo/:nombreGrupo', menor_controller.buscarMenorPorGrupo)

    // GET LISTA MENORES POR APELLIDO
    app.get('/menores/apellido/:apellido', menor_controller.buscarMenorPorApellido)
}

export default routing