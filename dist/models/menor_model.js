"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menor = void 0;
// Usamos Schema de mongoose y el modelo
const mongoose_1 = require("mongoose");
// Estructura del menor en la BD
const menorSchema = new mongoose_1.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  grupo: {
    type: String,
    required: true,
  },
});
exports.Menor = (0, mongoose_1.model)("Menor", menorSchema);
