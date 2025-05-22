// crearCoordinador.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Usuario } from './models/usuario_model';

import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });


async function crearCoordinador() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const email = 'admin@centro.com';
    const existente = await Usuario.findOne({ email });

    if (existente) {
      console.log('Ya existe un usuario con ese email');
      return;
    }

    const nuevo = new Usuario({
      name: 'Admin',
      surname: 'Centro',
      email,
      password: 'admin123',
      role: 'coordinador',
      isActive: true
    });

    await nuevo.save();

    console.log('Coordinador creado correctamente: admin@centro.com / admin123');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error al crear coordinador:', error);
  }
}

crearCoordinador();
