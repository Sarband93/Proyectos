import cron from 'node-cron';
import { desactivarSancionesCaducadas } from './desactivarSancionesCaducadas';

export const iniciarCronSanciones = (): void => {
    // Cada hora en punto → '0 * * * *'
    cron.schedule('0 * * * *', async () => {
        console.log('Ejecutando revisión automática de sanciones...');
        await desactivarSancionesCaducadas();
    });
};
