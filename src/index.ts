import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './database'
import routing from './routes/menor_route'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

routing(app)

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('✅ API  de Menores funcionando')
})

// Conectar a la base de datos
connectDB()

// Levantar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`)
})

function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status((err as any).statusCode) || 500
    res.json({ error: 1, message: err.message })
}

// function errorHandler(
//   err: Error & { status?: number },
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void {
//   const statusCode = err.status ?? 500 // ⬅ si no hay status, usamos 500
//   res.status(statusCode).json({
//     error: 1,
//     message: err.message || 'Error interno del servidor'
//   })
// }

app.use(errorHandler)
