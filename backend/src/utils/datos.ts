import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { Grupo } from '../models/grupo_model';
import { Educador } from '../models/educador_model';
import { Menor, IMenor } from '../models/menor_model';
import { Habitacion } from '../models/habitacion_model';

import { grupos } from '../data/grupos';
import { educadores } from '../data/educadores';
import { menores } from '../data/menores';
import { habitaciones } from '../data/habitaciones';

dotenv.config();

export async function poblarDatos() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/centro-menores');
    console.log('Conectado a MongoDB');

    await Promise.all([
      Grupo.deleteMany(),
      Educador.deleteMany(),
      Menor.deleteMany(),
      Habitacion.deleteMany()
    ]);

    const gruposInsertados = await Grupo.insertMany(
      grupos.map(g => ({
        ...g,
        educadorManana: null,
        educadorTarde: null,
        educadorFinde: null,
        habitaciones: [],
        menores: []
      }))
    );

    const grupoMap = Object.fromEntries(gruposInsertados.map(g => [g.nombre, g._id]));

    const educadoresData = educadores.map(e => ({
      ...e,
      grupoAsignado: grupoMap[e.grupo]
    }));
    const educadoresInsertados = await Educador.insertMany(educadoresData);

    for (const grupo of gruposInsertados) {
      const educadorManana = educadoresInsertados.find(e => e.turno === 'mañana' && String(e.grupoAsignado) === String(grupo._id));
      const educadorTarde = educadoresInsertados.find(e => e.turno === 'tarde' && String(e.grupoAsignado) === String(grupo._id));
      const educadorFinde = educadoresInsertados.find(e => e.turno === 'fines de semana' && String(e.grupoAsignado) === String(grupo._id));

      grupo.educadorManana = educadorManana?._id || null;
      grupo.educadorTarde = educadorTarde?._id || null;
      grupo.educadorFinde = educadorFinde?._id || null;
      await grupo.save();
    }

    // Insertar menores y mantener grupoNombre como referencia local
    const menoresConGrupo = menores.map(m => ({
      ...m,
      fechaNacimiento: m.fechaNacimiento,
      grupoNombre: m.grupo, // solo en memoria
      protocolosSeguridad: { PPA: false, OE: false, OA: false },
      salud: { dietas: [], alergias: [], intolerancias: [] },
      estado: { enSeparacionGrupo: false, enDomicilio: false },
      apoyoEducativo: { EI: false, AP: false },
      protocolosEspeciales: []
    }));

    const menoresInsertados = await Menor.insertMany(menoresConGrupo);

    // Reconstruimos la información manteniendo grupoNombre local
    const menoresConInfoGrupo = menoresInsertados.map((m, i) => ({
      ...m.toObject(),
      grupoNombre: menoresConGrupo[i].grupoNombre
    }));

    const habitacionesPreparadas = habitaciones.map(h => ({
      ...h,
      grupoId: grupoMap[h.grupo],
      menores: [] as mongoose.Types.ObjectId[],
      estado: 'vacía y limpia'
    }));

    for (const menor of menoresConInfoGrupo) {
      const grupoId = grupoMap[menor.grupoNombre];
      const habitacionesGrupo = habitacionesPreparadas.filter(h => String(h.grupoId) === String(grupoId));

      for (const hab of habitacionesGrupo) {
        if (hab.tipo === 'individual' && hab.menores.length === 0) {
          hab.menores.push(menor._id);
          hab.estado = 'ocupada';
          break;
        } else if (hab.tipo === 'doble' && hab.menores.length < 2) {
          hab.menores.push(menor._id);
          hab.estado = 'ocupada';
          break;
        }
      }
    }

    const habitacionesInsertadas = await Habitacion.insertMany(habitacionesPreparadas);

    for (const grupo of gruposInsertados) {
      const habitacionesGrupo = habitacionesInsertadas.filter(h => String(h.grupoId) === String(grupo._id));
      const menoresGrupo = menoresConInfoGrupo.filter(m => m.grupoNombre === grupo.nombre);

      grupo.habitaciones = habitacionesGrupo.map(h => h._id);
      grupo.menores = menoresGrupo.map(m => m._id);
      await grupo.save();
    }

    console.log('✅ Base de datos poblada con datos fijos correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar los datos:', error);
    process.exit(1);
  }
}

// Solo ejecutar si se llama directamente
if (require.main === module) {
  poblarDatos();
}
