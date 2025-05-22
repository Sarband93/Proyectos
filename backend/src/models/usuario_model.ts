import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { HydratedDocument } from 'mongoose';

export interface IUsuario {
    email: string;
    password: string;
    name: string;
    surname: string;
    role: 'educador' | 'coordinador';
    isActive: boolean;
    createdAt: Date;
}

const usuarioSchema = new Schema<IUsuario>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    role: { type: String, enum: ['educador', 'coordinador'], default: 'educador' },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Encriptar contraseña antes de guardar
// usuarioSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });
usuarioSchema.pre('save', async function (next) {
    const user = this as HydratedDocument<IUsuario>;

    if (!user.isModified('password')) return next();

    console.log('[PRE SAVE] Hasheando contraseña:', user.password); // 👈 AÑADE ESTO

    user.password = await bcrypt.hash(user.password, 10);
    next();
});

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
