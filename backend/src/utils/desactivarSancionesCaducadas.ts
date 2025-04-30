import { Sancion } from '../models/sancion_model';
import dayjs from 'dayjs';

export const desactivarSancionesCaducadas = async (): Promise<void> => {
    const ahora = dayjs();

    const sanciones = await Sancion.find({
        activa: true,
        fechaFin: { $lte: ahora.toDate() },
    });

    if (sanciones.length > 0) {
        for (const sancion of sanciones) {
            sancion.activa = false;
            await sancion.save();
        }

        console.log(
            `${sanciones.length} sanciones desactivadas automáticamente`
        );
    } else {
        console.log('ℹ️ No hay sanciones caducadas activas');
    }
};
