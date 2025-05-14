import { Grupo } from '../models/grupo_model';
import { poblarDatos } from './datos';

export async function poblarDatosSiNecesario() {
  const grupos = await Grupo.find();
  if (grupos.length === 0) {
    console.log('Base vacía. Insertando datos fijos...');
    await poblarDatos();
  } else {
    console.log('Datos ya insertados');
  }
}
