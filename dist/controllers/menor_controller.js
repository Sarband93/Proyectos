"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarMenorPorGrupo = buscarMenorPorGrupo;
exports.buscarMenorPorApellido = buscarMenorPorApellido;
exports.modificarMenor = modificarMenor;
exports.insertarVariosMenores = insertarVariosMenores;
const menor_model_1 = require("../models/menor_model");
const mongoose_1 = require("mongoose");
const BadRequestError_1 = __importDefault(
  require("../server/errors/BadRequestError"),
);
async function getMenor(req, res, next) {
  try {
    throw new Error("error de prueba");
    res.status(200).json({
      message: "Endpoint funcionando correctamente",
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
}
async function postMenor(req, res, next) {
  {
    try {
      const { nombre, apellido, edad, grupo } = req.body;
      const menor = new menor_model_1.Menor({ nombre, apellido, edad, grupo });
      const menorGuardado = await menor.save();
      res.status(200).json({
        message: "El chaval ha sido guardado correctamente",
        menor: menorGuardado,
      });
    } catch (error) {
      console.log(error);
      next(error);
      // res.status(500).json({
      //     mensaje: 'Error al guardar el chaval'
      // })
    }
  }
}
async function getListaMenores(req, res, next) {
  try {
    const menores = await menor_model_1.Menor.find();
    res.status(200).json({
      message: "Lista de menores correcta",
      menores,
    });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).json({
      message: "Error al listar menores",
    });
  }
}
async function buscarMenorPorGrupo(req, res, next) {
  try {
    const { nombreGrupo } = req.params;
    const menores = await menor_model_1.Menor.find({ grupo: nombreGrupo });
    res.status(200).json({
      message: `Menores del grupo ${nombreGrupo}`,
      menores,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar por grupo",
      error,
    });
  }
}
async function buscarMenorPorApellido(req, res, next) {
  try {
    const { apellido } = req.params;
    const menores = await menor_model_1.Menor.find({ apellido });
    res.status(200).json({
      message: `Menores con apellido ${apellido}`,
      menores,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar por apellido",
      error,
    });
  }
}
async function modificarMenor(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, apellido, edad, grupo } = req.body;
    // Comprueba si el ID es valido
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID no válido" });
      return;
    }
    // Busca y actualiza el menor
    const menorActualizado = await menor_model_1.Menor.findByIdAndUpdate(
      id,
      { nombre, apellido, edad, grupo },
      { new: true }, // Devuelve el objeto actualizado
    );
    if (!menorActualizado) {
      res.status(404).json({ message: "Menor no encontrado" });
      return;
    }
    res.status(200).json({
      message: "Menor actualizado correctamente",
      menor: menorActualizado,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
// Insertar varios menores a la bd
async function insertarVariosMenores(req, res, next) {
  try {
    const listaMenores = req.body;
    // if (!Array.isArray(listaMenores)) {
    //     res.status(400).json({ message: 'Debes insertar varios menores'})
    //     return
    // }
    if (!Array.isArray(listaMenores)) {
      throw new BadRequestError_1.default("Debes insertar varios menores");
    }
    const resultado = await menor_model_1.Menor.insertMany(listaMenores);
    // res.status(200).json({
    res.json({
      message: "menores insertados correctamente",
      menores: resultado,
    });
  } catch (error) {
    next(error);
  }
}
exports.default = {
  getMenor,
  postMenor,
  getListaMenores,
  buscarMenorPorGrupo,
  buscarMenorPorApellido,
  modificarMenor,
  insertarVariosMenores,
};
