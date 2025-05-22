<template lang="pug">
NavView.view-sanciones(icon='fas fa-gavel', title='Listado de sanciones')
    template(#header-right)
        button.btn.btn-success(@click='router.push({ name: "sancion-add" })')
            i.fas.fa-plus.me-2
            | Añadir sanción

    .container
        .mb-3.d-flex.align-items-center.gap-3
            input.form-control(type='text', v-model='busquedaMenor', placeholder='Buscar por menor...')
            .form-check.form-switch
                input#filtroActivas.form-check-input(type='checkbox', v-model='incluirInactivas')
                label.form-check-label(for='filtroActivas') Ver todas

        table.table.table-striped.table-bordered
            thead
                tr
                    th Menor
                    th Educador
                    th Tipo
                    th Motivo
                    th Fecha inicio
                    th Fecha fin
                    th Estado
                    th Acciones
            tbody
                tr(v-for='s in sancionesFiltradas', :key='s._id')
                    td
                        span.hover-link(@click='verMenor(s.menorId?._id)')
                            | {{ s.menorId?.nombre }} {{ s.menorId?.apellidos }}
                    td
                        span.hover-link(@click='verEducador(s.educadorId?._id)')
                            | {{ s.educadorId?.nombre }} {{ s.educadorId?.apellidos }}
                    td {{ s.tipo }}
                    td {{ s.motivo }}
                    td {{ formatoFecha(s.fecha) }}
                    td {{ s.fechaFin ? formatoFecha(s.fechaFin) : '-' }}
                    td
                        span.badge(:class='s.activa ? "bg-success" : "bg-secondary"')
                            | {{ s.activa ? 'Activa' : 'Inactiva' }}
                    td
                        button.btn.btn-sm.btn-outline-primary.me-2(@click='editarSancion(s._id)') Editar
                        button.btn.btn-sm.btn-outline-danger(v-if='s.activa', @click='desactivarSancion(s._id)') Desactivar
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import NavView from '@/components/nav/NavView.vue';

interface Persona {
    _id: string;
    nombre: string;
    apellidos: string;
}

interface Sancion {
    _id: string;
    menorId: Persona;
    educadorId: Persona;
    tipo: string;
    motivo: string;
    descripcion: string;
    fecha: string;
    fechaFin?: string;
    activa: boolean;
}

const router = useRouter();
const sanciones = ref<Sancion[]>([]);
const busquedaMenor = ref('');
const incluirInactivas = ref(false);

const obtenerSanciones = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/sanciones', {
            params: { incluirInactivas: incluirInactivas.value }
        });
        sanciones.value = res.data;
    } catch (error) {
        console.error('Error al cargar sanciones:', error);
    }
};

onMounted(() => {
    obtenerSanciones();
});

watch(incluirInactivas, () => {
    obtenerSanciones();
});

const sancionesFiltradas = computed(() => {
    const texto = busquedaMenor.value.toLowerCase();
    return sanciones.value.filter((s) => `${s.menorId?.nombre} ${s.menorId?.apellidos}`.toLowerCase().includes(texto));
});

const formatoFecha = (fecha: string) => {
    return dayjs(fecha).format('DD/MM/YYYY');
};

const editarSancion = (id: string) => {
    router.push({ name: 'sancion-edit', params: { id } });
};

const desactivarSancion = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas desactivar esta sanción?')) return;
    try {
        await axios.delete(`http://localhost:3000/api/sanciones/${id}`);
        await obtenerSanciones();
    } catch (error) {
        console.error('Error al desactivar la sanción:', error);
    }
};

const verMenor = (id?: string) => {
    if (id) router.push({ name: 'menor-detail', params: { id } });
};

const verEducador = (id?: string) => {
    if (id) router.push({ name: 'educador-detail', params: { id } });
};
</script>

<style scoped>
th,
td {
    vertical-align: middle;
}

.hover-link {
    cursor: pointer;
    color: inherit;
    transition:
        color 0.2s,
        text-decoration 0.2s;
}

.hover-link:hover {
    color: #0d6efd;
    text-decoration: underline;
}
</style>
