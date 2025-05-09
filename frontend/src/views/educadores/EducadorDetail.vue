<template lang="pug">
NavView.view-educador-detail(icon='fa fa-user-tie', title='Detalle del Educador')
    template(#header-right)
        button.btn.btn-outline-dark.me-2(@click='volver')
            i.fas.fa-arrow-left.me-2
            | Volver

        button.btn.btn-warning(@click='editarEducador')
            i.fas.fa-pen.me-2
            | Editar

    .container
        .card
            .card-header.bg-primary.text-white Datos del Educador
            .card-body
                p Nombre: {{ educador?.nombre }}
                p Apellidos: {{ educador?.apellidos }}
                p Turno: {{ educador?.turno }}
                p Grupo asignado: {{ educador?.grupoAsignado?.nombre || 'Sin grupo asignado' }}
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import NavView from '@/components/nav/NavView.vue';

const route = useRoute();
const router = useRouter();

interface Educador {
    nombre: string;
    apellidos: string;
    turno: string;
    grupoAsignado?: { nombre: string };
}

const educador = ref<Educador | null>(null);

const obtenerEducador = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/api/educadores/${route.params.id}`);
        educador.value = res.data;
    } catch (error) {
        console.error('Error al obtener educador:', error);
    }
};

const volver = () => {
    router.push({ name: 'educadores' });
};

const editarEducador = () => {
    router.push({ name: 'educador-edit', params: { id: route.params.id } });
};

onMounted(() => {
    obtenerEducador();
});
</script>

<style scoped>
.fixed-top-left {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1000;
}
</style>
