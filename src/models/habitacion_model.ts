import { Schema, model, Types } from 'mongoose';

export interface IHabitacion {
    identificador: string;
    grupoId: Types.ObjectId;
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
    menores: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Menor',
            default: [],
        },
    ],
});

export const Habitacion = model<IHabitacion>('Habitación', habitacionSchema);
