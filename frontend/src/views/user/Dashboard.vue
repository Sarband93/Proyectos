<template lang="pug">
NavView(icon='fas fa-chart-line', title='Dashboard')
    .container
        .p-3.p-md-5.mb-4.bg-light.rounded-3
            .container-fluid.py-4
                h2.mb-4 Bienvenido al Campus de menores, {{ username }} 👋
                .row.g-4
                    // Total menores
                    .col-md-6.col-lg-4
                        .card.shadow-sm.p-3
                            h5.mb-2
                                i.fas.fa-child.text-primary.me-2
                                | Menores registrados
                            h3.text-success {{ totalMenores }}

                    // Habitaciones ocupadas/libres
                    .col-md-6.col-lg-4
                        .card.shadow-sm.p-3
                            h5.mb-2
                                i.fas.fa-bed.text-warning.me-2
                                | Habitaciones disponibles
                            h3.text-dark {{ habitacionesLibres }} libres de {{ totalHabitaciones }}

                    // Sanciones activas
                    .col-md-6.col-lg-4
                        .card.shadow-sm.p-3
                            h5.mb-2
                                i.fas.fa-exclamation-triangle.text-danger.me-2
                                | Sanciones activas
                            h3.text-danger {{ sancionesActivas }}

                    // Educadores
                    .col-md-6.col-lg-4
                        .card.shadow-sm.p-3
                            h5.mb-2
                                i.fas.fa-user-tie.text-info.me-2
                                | Educadores
                            h3.text-primary {{ totalEducadores }}

                    // Grupos con ocupación
                    .col-12
                        .card.shadow-sm.p-3
                            h5.mb-3
                                i.fas.fa-users.text-secondary.me-2
                                | Menores por grupo
                            ul.list-group
                                li.list-group-item.d-flex.justify-content-between.align-items-center(v-for='g in grupos', :key='g._id')
                                    span {{ g.nombre }}
                                    span.badge.bg-secondary {{ g.totalMenores }}

                    // Alertas por sanciones a punto de vencer
                    .col-12(v-if='sancionesProximas.length')
                        .card.shadow-sm.p-3
                            h5.mb-3
                                i.fas.fa-clock.text-danger.me-2
                                | Sanciones a punto de finalizar
                            ul.list-group
                                li.list-group-item.d-flex.justify-content-between.align-items-center(
                                    v-for='s in sancionesProximas',
                                    :key='s._id')
                                    span
                                        b {{ s.menorId?.nombre }} {{ s.menorId?.apellidos }}
                                        |
                                        | - {{ s.tipo }}
                                        br
                                        small.text-muted {{ s.tiempoRestante }}
                                    span.badge.bg-warning.text-dark Alerta
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavView from '@/components/nav/NavView.vue';

// Tipos necesarios
interface Menor {
    _id: string;
}

interface Habitacion {
    menores: Menor[];
    estado: 'vacía y limpia' | 'ocupada';
}

interface GrupoApi {
    _id: string;
    nombre: string;
    habitaciones: Habitacion[];
}

interface GrupoDashboard {
    _id: string;
    nombre: string;
    totalMenores: number;
}

interface Sancion {
    _id: string;
    tipo: string;
    fechaFin: string;
    menorId: {
        nombre: string;
        apellidos: string;
    };
    tiempoRestante?: string;
}

// Datos del usuario
const username = 'Educador';

// Contadores del dashboard
const totalMenores = ref(0);
const totalHabitaciones = ref(0);
const habitacionesLibres = ref(0);
const sancionesActivas = ref(0);
const totalEducadores = ref(0);
const grupos = ref<GrupoDashboard[]>([]);

const sancionesProximas = ref<Sancion[]>([]);

const formatearFecha = (fecha: string): string => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

const calcularTiempoRestante = (fechaFin: string): string => {
    const ahora = new Date();
    const fin = new Date(fechaFin);
    const diffMs = fin.getTime() - ahora.getTime();

    if (diffMs <= 0) return 'Finaliza en breve';

    const totalSec = Math.floor(diffMs / 1000);
    const dias = Math.floor(totalSec / (3600 * 24));
    const horas = Math.floor((totalSec % (3600 * 24)) / 3600);
    const minutos = Math.floor((totalSec % 3600) / 60);
    const segundos = totalSec % 60;

    let resultado = 'Faltan ';
    if (dias > 0) resultado += `${dias}d `;
    if (horas > 0 || dias > 0) resultado += `${horas}h `;
    resultado += `${minutos}m ${segundos}s`;

    return resultado;
};

const actualizarTiemposRestantes = () => {
    sancionesProximas.value = sancionesProximas.value.map((s) => ({
        ...s,
        tiempoRestante: calcularTiempoRestante(s.fechaFin)
    }));
};

onMounted(async () => {
    try {
        const [menoresRes, habitacionesRes, sancionesRes, educadoresRes, gruposRes] = await Promise.all([
            axios.get('http://localhost:3000/api/menores'),
            axios.get('http://localhost:3000/api/habitaciones'),
            axios.get('http://localhost:3000/api/sanciones'),
            axios.get('http://localhost:3000/api/educadores'),
            axios.get('http://localhost:3000/api/grupos')
        ]);

        totalMenores.value = menoresRes.data.length;

        const habitaciones: Habitacion[] = habitacionesRes.data;
        totalHabitaciones.value = habitaciones.length;
        habitacionesLibres.value = habitaciones.filter((h) => h.estado === 'vacía y limpia').length;

        sancionesActivas.value = sancionesRes.data.length;
        totalEducadores.value = educadoresRes.data.length;

        const gruposApi: GrupoApi[] = gruposRes.data;
        grupos.value = gruposApi.map((grupo: GrupoApi) => ({
            _id: grupo._id,
            nombre: grupo.nombre,
            totalMenores: grupo.habitaciones.reduce((acc, hab) => acc + hab.menores.length, 0)
        }));

        const diasMaximos = 5;
        const ahora = new Date();

        sancionesProximas.value = sancionesRes.data.filter((s: Sancion) => {
            const fin = new Date(s.fechaFin);
            const diffMs = fin.getTime() - ahora.getTime();
            const diffDias = diffMs / (1000 * 60 * 60 * 24);
            return diffMs > 0 && diffDias <= diasMaximos;
        });

        // Inicializar tiempos restantes
        actualizarTiemposRestantes();

        // Actualizar cada minuto
        setInterval(() => {
            actualizarTiemposRestantes();
        }, 1000);
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
    }
});
</script>
