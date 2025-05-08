import { Schema, model, Types } from 'mongoose'
import dayjs from 'dayjs'

// Tipado de la sanción
export interface ISancion {
  menorId: Types.ObjectId
  educadorId: Types.ObjectId
  tipo: 'PAR' | 'SG' | 'Educador' | 'Lavandería' | 'Aula' | 'Separación' | 'Otras'
  motivo:
    | 'Comedor'
    | 'Fuga'
    | 'Juego de manos'
    | 'Insultos'
    | 'Autolesión'
    | 'Relaciones sexuales'
    | 'Manipulación'
    | 'Apología'
    | 'Piercings'
    | 'No responsabilizarse'
    | 'Pertenencias'
    | 'Terapéutica'
    | 'Otros'
  severidad?: 'leve' | 'grave'
  descripcion: string
  observaciones?: string
  fecha: Date
  duracionBloques?: number
  fechaFin?: Date
  fechaDesactivacion?: Date
  activa: boolean
}

// Esquema en Mongoose
const sancionSchema = new Schema<ISancion>({
  menorId: { type: Schema.Types.ObjectId, ref: 'Menor', required: true },
  educadorId: { type: Schema.Types.ObjectId, ref: 'Educador', required: true },
  tipo: {
    type: String,
    enum: ['PAR', 'SG', 'Educador', 'Lavandería', 'Aula', 'Separación', 'Otras'],
    required: true,
  },
  motivo: {
    type: String,
    enum: [
      'Comedor',
      'Fuga',
      'Juego de manos',
      'Insultos',
      'Autolesión',
      'Relaciones sexuales',
      'Manipulación',
      'Apología',
      'Piercings',
      'No responsabilizarse',
      'Pertenencias',
      'Terapéutica',
      'Otros',
    ],
    required: true,
  },
  severidad: {
    type: String,
    enum: ['leve', 'grave'],
    default: 'leve',
  },
  descripcion: { type: String, required: true, trim: true },
  observaciones: { type: String, trim: true },
  fecha: { type: Date, default: Date.now },
  duracionBloques: { type: Number },
  fechaFin: { type: Date },
  fechaDesactivacion: { type: Date },
  activa: { type: Boolean, default: true },
})

// Cálculo automático de fechaFin a partir de fecha + bloques
sancionSchema.pre('save', function (next) {
  if (
    !this.isModified('duracionBloques') ||
    !this.fecha ||
    !this.duracionBloques
  )
    return next()

  const start = dayjs(this.fecha)
  const bloques = this.duracionBloques
  const diasCompletos = Math.floor(bloques)
  const medioDiaExtra = bloques % 1 === 0.5

  let fechaFinal = start.add(diasCompletos, 'day')

  if (medioDiaExtra) {
    fechaFinal = fechaFinal.hour(16).minute(0).second(0)
  } else {
    fechaFinal = fechaFinal.add(1, 'day').startOf('day')
  }

  this.fechaFin = fechaFinal.toDate()
  next()
})

export const Sancion = model<ISancion>('Sancion', sancionSchema)
