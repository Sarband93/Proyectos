// Usamos Schema de mongoose y el modelo
import { Schema, model } from 'mongoose'


// Los datos que va a tener el menor
export interface IMenor {
    nombre: string
    apellido: string
    edad: number
    grupo: string
    
}

// Estructura del menor en la BD
const menorSchema = new Schema<IMenor>({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    grupo: {
        type: String,
        required: true
    }
})

export const Menor = model<IMenor>('Menor', menorSchema)