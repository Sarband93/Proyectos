import { Schema, model, Types } from 'mongoose';

export interface IGrupo {
    nombre: string;
    habitaciones: Types.ObjectId[];
    menores: Types.ObjectId[];
    educadorManana: Types.ObjectId | null;
    educadorTarde: Types.ObjectId | null;
    educadorFinde: Types.ObjectId | null;
}

const grupoSchema = new Schema<IGrupo>({
    nombre: {
        type: String,
        required: true,
        unique: true,
    },
    habitaciones: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Habitacion',
            default: [],
        },
    ],
    menores: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Menor',
            default: [],
        },
    ],
    educadorManana: {
        type: Schema.Types.ObjectId,
        ref: 'Educador',
        default: null,
    },
    educadorTarde: {
        type: Schema.Types.ObjectId,
        ref: 'Educador',
        default: null,
    },
    educadorFinde: {
        type: Schema.Types.ObjectId,
        ref: 'Educador',
        default: null,
    },
});

export const Grupo = model<IGrupo>('Grupo', grupoSchema);
