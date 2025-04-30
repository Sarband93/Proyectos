import { Schema, model } from 'mongoose';

export interface IUsuario {
    nombre: string;
    email: string;
    password: string;
    rol: 'educador' | 'admin';
}

const usuarioSchema = new Schema<IUsuario>({
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    rol: {
        type: String,
        enum: ['educador', 'admin'],
        default: 'educador',
    },
});

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
