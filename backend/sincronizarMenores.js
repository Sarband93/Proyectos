"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const menor_model_1 = require("./src/models/menor_model");
const habitacion_model_1 = require("./src/models/habitacion_model");
const sincronizarGruposYHabitaciones = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/centroMenores');
        const habitaciones = await habitacion_model_1.Habitacion.find().populate('grupoId');
        let actualizados = 0;
        for (const habitacion of habitaciones) {
            const grupoId = habitacion.grupoId?._id;
            if (!grupoId)
                continue;
            for (const menorId of habitacion.menores) {
                const menor = await menor_model_1.Menor.findById(menorId);
                if (!menor)
                    continue;
                const cambios = {};
                if (!menor.habitacionId || menor.habitacionId.toString() !== habitacion._id.toString()) {
                    cambios.habitacionId = habitacion._id;
                }
                if (!menor.grupoId || menor.grupoId.toString() !== grupoId.toString()) {
                    cambios.grupoId = grupoId;
                }
                if (Object.keys(cambios).length > 0) {
                    await menor_model_1.Menor.findByIdAndUpdate(menor._id, cambios);
                    actualizados++;
                }
            }
        }
        console.log(`Sincronización completada. Menores actualizados: ${actualizados}`);
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error durante la sincronización:', error);
        process.exit(1);
    }
};
sincronizarGruposYHabitaciones();
