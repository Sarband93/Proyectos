import { Schema, model, Types } from 'mongoose';
import dayjs from 'dayjs';

export interface ISancion {
    menorId: Types.ObjectId;
    tipo:
        | 'SG'
        | 'PAR'
        | 'Lavandería'
        | 'Aula'
        | 'Educador'
        | 'Separación'
        | 'Otras';
    descripcion: string;
    fecha: Date;
    educadorId: Types.ObjectId;
    duracionBloques?: number;
    fechaFin?: Date;
    activa: boolean;
}

const sancionSchema = new Schema<ISancion>({
    menorId: { type: Schema.Types.ObjectId, ref: 'Menor', required: true },
    tipo: {
        type: String,
        enum: [
            'SG',
            'PAR',
            'Lavandería',
            'Aula',
            'Educador',
            'Separación',
            'Otras',
        ],
        required: true,
    },
    descripcion: { type: String, required: true, trim: true },
    fecha: { type: Date, default: Date.now },
    educadorId: {
        type: Schema.Types.ObjectId,
        ref: 'Educador',
        required: true,
    },
    duracionBloques: { type: Number }, // 0.5, 1, 1.5...
    fechaFin: { type: Date }, // ← ¡se calculará automáticamente!
    activa: { type: Boolean, default: true },
});

sancionSchema.pre('save', function (next) {
    if (
        !this.isModified('duracionBloques') ||
        !this.fecha ||
        !this.duracionBloques
    )
        return next();

    const start = dayjs(this.fecha);

    const bloques = this.duracionBloques;
    const diasCompletos = Math.floor(bloques);
    const medioDiaExtra = bloques % 1 === 0.5;

    let fechaFinal = start.add(diasCompletos, 'day');

    if (medioDiaExtra) {
        // Si hay medio día, termina a las 16:00
        fechaFinal = fechaFinal.hour(16).minute(0).second(0);
    } else {
        // Si no hay medio día extra, termina a las 00:00 del siguiente día
        fechaFinal = fechaFinal.add(1, 'day').startOf('day');
    }

    this.fechaFin = fechaFinal.toDate();

    next();
});

export const Sancion = model<ISancion>('Sancion', sancionSchema);
