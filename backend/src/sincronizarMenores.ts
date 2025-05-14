import mongoose, { Schema } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Registrar el modelo Grupo manualmente (mínimo)
mongoose.model('Grupo', new Schema({
  nombre: { type: String, required: true }
}));

import { Habitacion } from './models/habitacion_model';
import { Menor } from './models/menor_model';




const sincronizarGruposYHabitaciones = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/centroMenoresPruebas');
    mongoose.model('Grupo');
    const habitaciones = await Habitacion.find().populate('grupoId');
    let actualizados = 0;

    for (const habitacion of habitaciones) {
      const grupoId = habitacion.grupoId?._id;
      if (!grupoId) continue;

      for (const menorId of habitacion.menores) {
        const menor = await Menor.findById(menorId);
        if (!menor) continue;

        const cambios: Partial<typeof menor> = {};
        if (!menor.habitacionId || menor.habitacionId.toString() !== habitacion._id.toString()) {
          cambios.habitacionId = habitacion._id;
        }
        if (!menor.grupoId || menor.grupoId.toString() !== grupoId.toString()) {
          cambios.grupoId = grupoId;
        }

        if (Object.keys(cambios).length > 0) {
          await Menor.findByIdAndUpdate(menor._id, cambios);
          actualizados++;
        }
      }
    }

    console.log(`Sincronización completada. Menores actualizados: ${actualizados}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error durante la sincronización:', error);
    process.exit(1);
  }
};

sincronizarGruposYHabitaciones();