// Usamos Schema de mongoose y el modelo
import { Schema, model, Types } from 'mongoose';

// Los datos que va a tener el menor
export interface IMenor {
    nombre: string;
    apellidos: string;
    fechaNacimiento: Date;
    tutelado: boolean;

    protocolosSeguridad: {
        PPA: boolean;
        OE: boolean;
        OA: boolean;
    };

    salud: {
        dietas: string[];
        alergias: string[];
        intolerancias: string[];
    };

    protocolosEspeciales: string[]; // Ej: Riesgo de fuga, supervision de libros

    medicaciones: string[];
    bajaDeportiva: boolean;

    apoyoEducativo: {
        EI: boolean;
        AP: boolean;
    };

    estado: {
        enSeparacionGrupo: boolean;
        enDomicilio: boolean;
    };

    habitacionId: Types.ObjectId;
    grupoId: Types.ObjectId;
}

// Estructura del menor en la BD
const menorSchema = new Schema<IMenor>({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    tutelado: { type: Boolean, default: false },

    protocolosSeguridad: {
        PPA: { type: Boolean, default: false },
        OE: { type: Boolean, default: false },
        OA: { type: Boolean, default: false },
    },

    salud: {
        dietas: { type: [String], default: [] },
        alergias: { type: [String], default: [] },
        intolerancias: { type: [String], default: [] },
    },

    protocolosEspeciales: { type: [String], default: [] },

    medicaciones: { type: [String], default: [] },
    bajaDeportiva: { type: Boolean, default: false },

    apoyoEducativo: {
        EI: { type: Boolean, default: false },
        AP: { type: Boolean, default: false },
    },

    estado: {
        enSeparacionGrupo: { type: Boolean, default: false },
        enDomicilio: { type: Boolean, default: false },
    },

    habitacionId: { type: Schema.Types.ObjectId, ref: 'Habitacion' },
    grupoId: { type: Schema.Types.ObjectId, ref: 'Grupo' },
});

export const Menor = model<IMenor>('Menor', menorSchema);
