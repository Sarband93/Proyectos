import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database';
import HttpError from './server/errors/HttpError';
import { desactivarSancionesCaducadas } from './utils/desactivarSancionesCaducadas';
import { iniciarCronSanciones } from './utils/cron';

// Rutas personalizadas
import routingMenor from './routes/menor_route';
import routingGrupo from './routes/grupo_route';
import routingHabitacion from './routes/habitacion_route';
import routingEducador from './routes/educador_route';
import routingSancion from './routes/sancion_route';
import routingAuth from './routes/auth_route';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
routingMenor(app);
routingGrupo(app);
routingHabitacion(app);
routingEducador(app);
routingSancion(app);
routingAuth(app);

// Ruta de prueba
app.get('/', (_req, res) => {
    res.send('✅ API del Centro de Menores funcionando');
});

// Middleware de errores personalizado
function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    const statusCode = (err as HttpError).statusCode || 500;
    res.status(statusCode).json({
        error: 1,
        message: err.message || 'Error del servidor',
    });
}

app.use(errorHandler);

// Conexión a la base de datos
connectDB().then(() => {
    desactivarSancionesCaducadas();
    iniciarCronSanciones();
});

// Arrancar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
