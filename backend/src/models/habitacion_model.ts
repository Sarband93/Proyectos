import { Schema, model, Types } from 'mongoose';

export interface IHabitacion {
  identificador: string;
  grupoId: Types.ObjectId;
  tipo: 'individual' | 'doble';
  estado: 'vacía y limpia' | 'ocupada';
  menores: Types.ObjectId[];
}

const habitacionSchema = new Schema<IHabitacion>({
  identificador: {
    type: String,
    required: true,
    trim: true,
  },
  grupoId: {
    type: Schema.Types.ObjectId,
    ref: 'Grupo',
    required: true,
  },
  tipo: {
    type: String,
    enum: ['individual', 'doble'],
    required: true,
  },
  estado: {
    type: String,
    enum: ['vacía y limpia', 'ocupada'],
    default: 'vacía y limpia',
  },
  menores: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Menor',
      default: [],
    },
  ],
});

export const Habitacion = model<IHabitacion>('Habitacion', habitacionSchema);
