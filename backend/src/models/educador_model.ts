import { Schema, model, Types } from 'mongoose';

export interface IEducador {
    nombre: string;
    apellidos: string;
    turno: 'mañana' | 'tarde' | 'noche' | 'fines de semana';
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
        enum: ['mañana', 'tarde', 'noche', 'fines de semana'],
        required: true,
    },
    grupoAsignado: {
        type: Schema.Types.ObjectId,
        ref: 'Grupo',
        required: false,
    },
});

export const Educador = model<IEducador>('Educador', educadorSchema);
