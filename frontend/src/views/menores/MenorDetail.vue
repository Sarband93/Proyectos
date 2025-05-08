<template lang="pug">
NavView.view-menor-detail(icon='fa fa-child', title='Información del menor')
    .container
        ul.list-group
            li.list-group-item Nombre: {{ menor?.nombre }}
            li.list-group-item Apellidos: {{ menor?.apellidos }}
            li.list-group-item Fecha de nacimiento: {{ formatoFecha(menor?.fechaNacimiento) }}
            li.list-group-item Edad: {{ calcularEdad(menor?.fechaNacimiento) }} años
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import NavView from '@/components/nav/NavView.vue';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

const menor = ref<any>(null);

const obtenerMenor = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/api/menores/${route.params.id}`);
        menor.value = res.data;
    } catch (error) {
        console.error('Error al cargar menor:', error);
    }
};

const calcularEdad = (fechaNacimiento: string): number => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

const formatoFecha = (fecha: string): string => {
    return dayjs(fecha).format('DD/MM/YYYY');
};
</script>
