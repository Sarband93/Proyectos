<template lang="pug">
.NavView.view-cuadrante(icon='fa fa-th', title='Cuadrante de menores')
    .container-fluid
        .table-responsive
            table.table.table-bordered.table-sm.text-center
                thead
                    tr
                        th Grupo
                        th(v-for='n in maxHabitaciones', :key='n') H {{ n }}
                tbody
                    tr(v-for='grupo in grupos', :key='grupo._id')
                        td {{ grupo.nombre }}
                        td(
                            v-for='hab in grupo.habitaciones',
                            :key='hab._id',
                            :class='{ "bg-gray-dark": hab.menores.some((m) => m.estado?.enDomicilio), "bg-gray-light": hab.menores.some((m) => m.estado?.enSeparacionGrupo), "bg-gray-full": hab.menores.some((m) => m.sancionesActivas?.some((s) => s.tipo === "SG")), "cursor-pointer": hab.menores.length > 0 }',
                            @click='hab.menores.length > 0 && irADetalleMenor(hab.menores[0]._id)')
                            .d-flex.flex-column.h-100(v-if='hab.menores.length === 2')
                                .flex-fill.border-bottom.p-1(v-for='menor in hab.menores', :key='menor._id')
                                    span.badge.nombre-menor.bg-secondary(@click.stop='irADetalleMenor(menor._id)', style='cursor: pointer')
                                        | {{ menor.nombre }} {{ menor.apellidos }}
                                        span.etiqueta.bg-rojo(v-if='menor.protocolosSeguridad?.PPA') PPA
                                        span.etiqueta.bg-rojo(v-if='menor.protocolosSeguridad?.OE') OE
                                        span.etiqueta.bg-rojo(v-if='menor.protocolosSeguridad?.OA') OA
                                        span.etiqueta.bg-morado(v-if='menor.tutelado') TUT
                                    .mt-1.ps-2.text-start.small
                                        div(v-for='(dieta, i) in menor.salud?.dietas', :key='`dieta-${i}`')
                                            span.highlight-rosa.small-text {{ dieta }}
                                        div(v-for='(alergia, i) in menor.salud?.alergias', :key='`alergia-${i}`')
                                            span.highlight-rosa.small-text {{ alergia }}
                                        div(v-for='(intol, i) in menor.salud?.intolerancias', :key='`intol-${i}`')
                                            span.highlight-rosa.small-text {{ intol }}
                                        div(v-for='(med, i) in menor.medicaciones', :key='`med-${i}`')
                                            span.highlight-azul.small-text {{ med }}
                                    div(v-if='menor.sancionesActivas?.length')
                                        div(v-for='s in menor.sancionesActivas', :key='s._id')
                                            small.underline-gris(v-if='s.tipo === "SG"') SG hasta {{ formatearFechaFinSancion(s.fechaFin) }}
                            .p-1.rounded(v-else-if='hab.menores.length === 1')
                                span.badge.nombre-menor.bg-secondary(
                                    @click.stop='irADetalleMenor(hab.menores[0]._id)',
                                    style='cursor: pointer')
                                    | {{ hab.menores[0].nombre }} {{ hab.menores[0].apellidos }}
                                    span.etiqueta.bg-rojo(v-if='hab.menores[0].protocolosSeguridad?.PPA') PPA
                                    span.etiqueta.bg-rojo(v-if='hab.menores[0].protocolosSeguridad?.OE') OE
                                    span.etiqueta.bg-rojo(v-if='hab.menores[0].protocolosSeguridad?.OA') OA
                                    span.etiqueta.bg-morado(v-if='hab.menores[0].tutelado') TUT
                                .mt-1.ps-2.text-start.small
                                    div(v-for='(dieta, i) in hab.menores[0].salud?.dietas', :key='`dieta-${i}`')
                                        span.highlight-rosa.small-text {{ dieta }}
                                    div(v-for='(alergia, i) in hab.menores[0].salud?.alergias', :key='`alergia-${i}`')
                                        span.highlight-rosa.small-text {{ alergia }}
                                    div(v-for='(intol, i) in hab.menores[0].salud?.intolerancias', :key='`intol-${i}`')
                                        span.highlight-rosa.small-text {{ intol }}
                                    div(v-for='(med, i) in hab.menores[0].medicaciones', :key='`med-${i}`')
                                        span.highlight-azul.small-text {{ med }}
                                div(v-if='hab.menores[0].sancionesActivas?.length')
                                    div(v-for='s in hab.menores[0].sancionesActivas', :key='s._id')
                                        small.underline-gris.small-text(v-if='s.tipo === "SG"') SG hasta ({{ formatearFechaFinSancion(s.fechaFin) }})
                            div(v-else)
                                span.text-muted vacía
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface SancionActiva {
    _id: string;
    tipo: string;
    fechaFin: string;
    activa: boolean;
}

interface Menor {
    _id: string;
    nombre: string;
    apellidos: string;
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
        bajaDeporte: boolean;
    };
    medicaciones: string[];
    protocolosEspeciales: string[];
    apoyoEducativo?: {
        necesitaApoyo: boolean;
    };
    estado?: {
        enSeparacionGrupo: boolean;
        enDomicilio: boolean;
        fechaFinSancion: string;
    };
    sancionesActivas?: SancionActiva[];
}

interface Habitacion {
    _id: string;
    menores: Menor[];
}

interface Grupo {
    _id: string;
    nombre: string;
    habitaciones: Habitacion[];
}

const grupos = ref<Grupo[]>([]);
const maxHabitaciones = ref(0);
const router = useRouter();

const obtenerCuadrante = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/grupos');
        grupos.value = res.data;
        maxHabitaciones.value = Math.max(...grupos.value.map((g) => g.habitaciones.length));
    } catch (error) {
        console.error('Error al cargar cuadrante:', error);
    }
};

const irADetalleMenor = (id: string) => {
    router.push({ name: 'menor-detail', params: { id } });
};

const formatearFechaFinSancion = (fechaStr: string) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    const hora = fecha.getHours() < 18 ? '16h' : '24h';
    return `${fecha.toLocaleDateString('es-ES')} (${hora})`;
};

onMounted(() => {
    obtenerCuadrante();
});
</script>

<style scoped>
.bg-gray-dark {
    background-color: #a9a9a9 !important;
}
.bg-gray-light {
    background-color: #d3d3d3 !important;
}
.bg-gray-full {
    background-color: #e0e0e0 !important;
}
.cursor-pointer {
    cursor: pointer;
}
.etiqueta {
    margin-left: 4px;
    padding: 2px 4px;
    font-size: 0.6rem;
    font-weight: bold;
    text-transform: uppercase;
    text-decoration: underline;
    border-radius: 4px;
    color: white;
}
.bg-rojo {
    background-color: crimson;
}
.bg-morado {
    background-color: purple;
}
.nombre-menor {
    color: white !important;
    text-decoration: underline;
    text-decoration-color: gray;
}
.highlight-rosa {
    background-color: hotpink;
    color: white;
    padding: 0 4px;
    border-radius: 3px;
}
.highlight-azul {
    background-color: #0aa6e4;
    color: white;
    padding: 0 4px;
    border-radius: 3px;
}
.underline-gris {
    color: gray;
    font-weight: bold;
}
.small-text {
    font-size: 0.7rem;
}
</style>
