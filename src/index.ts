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
app.use(errorHandler)

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

// Error handler function
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status((err as any).status) || 500;
  res.json({ error: 1, message: err.message})
}

