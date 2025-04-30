import { Schema, model, Types } from 'mongoose';

export interface IGrupo {
    nombre: string;
    habitaciones: Types.ObjectId[];
    menores: Types.ObjectId[];
    educadorManana: Types.ObjectId;
    educadorTarde: Types.ObjectId;
    educadorFinde: Types.ObjectId;
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
        required: true,
    },
    educadorTarde: {
        type: Schema.Types.ObjectId,
        ref: 'Educador',
        required: true,
    },
    educadorFinde: {
        type: Schema.Types.ObjectId,
        ref: 'Educador',
        required: true,
    },
});

export const Grupo = model<IGrupo>('Grupo', grupoSchema);
