import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { fakerES as faker } from '@faker-js/faker';

import { Menor, IMenor } from '../models/menor_model';
import { Educador } from '../models/educador_model';
import { Grupo } from '../models/grupo_model';
import { Sancion } from '../models/sancion_model';
import { Habitacion, IHabitacion } from '../models/habitacion_model';

dotenv.config();

const gruposFijos = [
  'África', 'Asia', 'Europa', 'América',
  'Samoa', 'Fiji', 'Polinesia'
];

const turnos = ['mañana', 'tarde', 'fines de semana'];

const menores = Array.from({ length: 90 }, () => {
  const grupo = gruposFijos[Math.floor(Math.random() * gruposFijos.length)];
  const nacimiento = faker.date.birthdate({ min: 12, max: 18, mode: 'age' });
  return {
    nombre: faker.person.firstName(),
    apellidos: faker.person.lastName(),
    edad: dayjs().diff(nacimiento, 'year'),
    grupo,
    fechaNacimiento: nacimiento
  };
});

const tipos = ['PAR', 'SG', 'Educador', 'Lavandería', 'Aula', 'Separación', 'Otras'];
const motivos = [
  'Comedor', 'Fuga', 'Juego de manos', 'Insultos', 'Autolesión', 'Relaciones sexuales',
  'Manipulación', 'Apología', 'Piercings', 'No responsabilizarse',
  'Pertenencias', 'Terapéutica', 'Otros'
];

const sancionesCatalogo = tipos.flatMap(tipo =>
  (faker.helpers.arrayElements(motivos, 3) as string[]).map((motivo: string) => ({
    tipo,
    motivo,
    descripcion: `Sanción por ${motivo.toLowerCase()}.`,
    severidad: faker.helpers.arrayElement(['leve', 'grave']),
    duracionBloques: faker.helpers.arrayElement([0.5, 1, 1.5, 2]),
    activa: true,
    fecha: new Date()
  }))
);

async function populateDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/centro-menores');
    console.log('📡 Conectado a MongoDB');

    await Menor.deleteMany();
    await Educador.deleteMany();
    await Grupo.deleteMany();
    await Habitacion.deleteMany();
    await Sancion.deleteMany();

    const menoresInsertados = await Menor.insertMany(menores);

    const gruposFinales = gruposFijos.map(nombre => ({
      nombre,
      educadorManana: new mongoose.Types.ObjectId(),
      educadorTarde: new mongoose.Types.ObjectId(),
      educadorFinde: new mongoose.Types.ObjectId(),
      habitaciones: [],
      menores: []
    }));

    const gruposInsertados = await Grupo.insertMany(gruposFinales);

    const educadoresData: {
      nombre: string;
      apellidos: string;
      turno: string;
      grupoAsignado: mongoose.Types.ObjectId;
    }[] = [];

    for (const grupo of gruposInsertados) {
      for (const turno of turnos) {
        educadoresData.push({
          nombre: faker.person.firstName(),
          apellidos: faker.person.lastName(),
          turno,
          grupoAsignado: grupo._id,
        });
      }
    }

    for (let i = 0; i < 10; i++) {
      educadoresData.push({
        nombre: faker.person.firstName(),
        apellidos: faker.person.lastName(),
        turno: 'noche',
        grupoAsignado: gruposInsertados[0]._id,
      });
    }

    const educadoresInsertados = await Educador.insertMany(educadoresData);

    const educadoresManana = educadoresInsertados.filter(e => e.turno === 'mañana');
    const educadoresTarde = educadoresInsertados.filter(e => e.turno === 'tarde');
    const educadoresFinde = educadoresInsertados.filter(e => e.turno === 'fines de semana');

    for (const grupo of gruposInsertados) {
      const educadorManana = educadoresManana.find(e => String(e.grupoAsignado) === String(grupo._id))?._id;
      const educadorTarde = educadoresTarde.find(e => String(e.grupoAsignado) === String(grupo._id))?._id;
      const educadorFinde = educadoresFinde.find(e => String(e.grupoAsignado) === String(grupo._id))?._id;

      if (!educadorManana || !educadorTarde || !educadorFinde) {
        throw new Error(`Faltan educadores para el grupo ${grupo.nombre}`);
      }

      grupo.educadorManana = educadorManana;
      grupo.educadorTarde = educadorTarde;
      grupo.educadorFinde = educadorFinde;
      await grupo.save();
    }

    const habitaciones: Partial<IHabitacion>[] = [];

    for (const grupo of gruposInsertados) {
      const nombreGrupo = grupo.nombre;
      const totalHabitaciones = ['Samoa', 'Fiji', 'Polinesia'].includes(nombreGrupo) ? 13 : 9;

      for (let i = 1; i <= totalHabitaciones; i++) {
        habitaciones.push({
          identificador: `${nombreGrupo} - ${i}`,
          grupoId: grupo._id,
          tipo: i === 4 || i === 8 ? 'doble' : 'individual',
          estado: 'vacía y limpia',
          menores: []
        });
      }
    }

    for (const menor of menoresInsertados) {
      const grupo = gruposInsertados.find(g => g.nombre === menor.grupo);
      const candidatas = habitaciones.filter(h => String(h.grupoId) === String(grupo?._id));

      for (const hab of candidatas) {
        if (hab.tipo === 'individual' && hab.menores!.length === 0) {
          hab.menores!.push(menor._id);
          hab.estado = 'ocupada';
          break;
        } else if (hab.tipo === 'doble' && hab.menores!.length < 2) {
          hab.menores!.push(menor._id);
          hab.estado = 'ocupada';
          break;
        }
      }
    }

    await Habitacion.insertMany(habitaciones);

    const sanciones = sancionesCatalogo.map(s => ({
      ...s,
      menorId: faker.helpers.arrayElement(menoresInsertados)._id,
      educadorId: faker.helpers.arrayElement(educadoresInsertados)._id
    }));

    await Sancion.insertMany(sanciones);

    for (const grupo of gruposInsertados) {
      const habitacionesGrupo = await Habitacion.find({ grupoId: grupo._id });
      const menoresGrupo = menoresInsertados.filter((m: IMenor & { grupo: string }) => m.grupo === grupo.nombre);

      grupo.habitaciones = habitacionesGrupo.map(h => h._id);
      grupo.menores = menoresGrupo.map(m => m._id);
      await grupo.save();
    }

    console.log('Base de datos poblada completamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

populateDB();
