"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function registrarMenor(req, res) {
  const { id, nombre, edad, grupo } = req.body;
  res.status(200).json({
    mensaje: "El chaval ha sido recibido correctamente",
    menor: {
      id,
      nombre,
      edad,
      grupo,
    },
  });
}
