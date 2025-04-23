"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const menor_controller_1 = __importDefault(
  require("../controllers/menor_controller"),
);
function routing(app) {
  // GET CONTROLLER ROUTE
  app.get("/get-menor", menor_controller_1.default.getMenor);
  // POST CONTROLLER ROUTE
  app.post("/post-menor", menor_controller_1.default.postMenor);
  // POST PARA INSERTAR VARIOS MENORES A LA VEZ
  app.post(
    "/post-inserta-lista",
    menor_controller_1.default.insertarVariosMenores,
  );
  // GET LISTA MENORES
  app.get("/menores", menor_controller_1.default.getListaMenores);
  // GET LISTA MENORES POR GRUPO
  app.get(
    "/menores/grupo/:nombreGrupo",
    menor_controller_1.default.buscarMenorPorGrupo,
  );
  // GET LISTA MENORES POR APELLIDO
  app.get(
    "/menores/apellido/:apellido",
    menor_controller_1.default.buscarMenorPorApellido,
  );
  // PUT PARA MODIFICAR MENOR
  app.put("/menores/:id", menor_controller_1.default.modificarMenor);
}
exports.default = routing;
