import { type Express } from "express";
import menor_controller from "../controllers/menor_controller";

function routing(app: Express): void {
  // GET CONTROLLER ROUTE
  app.get("/get-menor", menor_controller.getMenor);
  // POST CONTROLLER ROUTE
  app.post("/post-menor", menor_controller.postMenor);

  // POST PARA INSERTAR VARIOS MENORES A LA VEZ
  app.post("/post-inserta-lista", menor_controller.insertarVariosMenores);

  // GET LISTA MENORES
  app.get("/menores", menor_controller.getListaMenores);

  // GET LISTA MENORES POR GRUPO
  app.get("/menores/grupo/:nombreGrupo", menor_controller.buscarMenorPorGrupo);

  // GET LISTA MENORES POR APELLIDO
  app.get(
    "/menores/apellido/:apellido",
    menor_controller.buscarMenorPorApellido,
  );

  // PUT PARA MODIFICAR MENOR
  app.put("/menores/:id", menor_controller.modificarMenor);
}

export default routing;
