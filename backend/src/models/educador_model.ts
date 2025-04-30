import { Schema, model, Types } from 'mongoose';

export interface IEducador {
    nombre: string;
    apellidos: string;
    turno: 'mañana' | 'tarde' | 'finde' | 'noche';
    grupoAsignado?: Types.ObjectId;
}

const educadorSchema = new Schema<IEducador>({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    apellidos: {
        type: String,
        required: true,
        trim: true,
    },
    turno: {
        type: String,
        enum: ['mañana', 'tarde', 'finde', 'noche'],
        required: true,
    },
    grupoAsignado: {
        type: Schema.Types.ObjectId,
        ref: 'Grupo',
        required: false,
    },
});

export const Educador = model<IEducador>('Educador', educadorSchema);
