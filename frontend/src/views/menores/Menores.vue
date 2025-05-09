<template lang="pug">
NavView.view-menores(icon='fa fa-users', title='Lista de menores')
    template(#header-right)
        button.btn.btn-success(@click='irANuevoMenor') + Añadir menor
    .container
        input.form-control.mb-3(type='text', v-model='busqueda', placeholder='Buscar menor...')

        table.table.table-striped.table-bordered
            thead
                tr
                    th Nombre
                    th Apellidos
                    th Edad
                    th Grupo
                    th Acciones
            tbody
                tr(v-for='menor in menoresFiltrados', :key='menor._id')
                    td {{ menor.nombre }}
                    td {{ menor.apellidos }}
                    td {{ calcularEdad(menor.fechaNacimiento) }} años
                    td {{ menor.grupoId?.nombre || 'Sin grupo' }}
                    td
                        button.btn.btn-sm.btn-primary(@click='verDetalles(menor)') Ver
                        button.btn.btn-sm.btn-warning.ms-2(@click='editarMenor(menor._id)') Editar
                        button.btn.btn-sm.btn-danger.ms-2(@click='eliminarMenor(menor._id)') Eliminar
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';

import NavView from '@/components/nav/NavView.vue';

interface Grupo {
    _id: string;
    nombre: string;
}

interface Menor {
    _id: string;
    nombre: string;
    apellidos: string;
    fechaNacimiento: string;
    protocolo: string;
    grupoId?: {
        nombre: string;
    };
}

const router = useRouter();
const menores = ref<Menor[]>([]);
const busqueda = ref('');

const obtenerMenores = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/menores');
        menores.value = res.data;
    } catch (error) {
        console.error('Error al obtener menores:', error);
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

const verDetalles = (menor: Menor) => {
    router.push({ name: 'menor-detail', params: { id: menor._id } });
};

const editarMenor = (id: string) => {
    router.push({ name: 'menor-edit', params: { id } });
};

const eliminarMenor = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este menor?')) return;
    try {
        await axios.delete(`http://localhost:3000/api/menores/${id}`);
        menores.value = menores.value.filter((m) => m._id !== id);
    } catch (error) {
        console.error('Error al eliminar menor:', error);
    }
};

const irANuevoMenor = () => {
    router.push({ name: 'menor-add' });
};

const menoresFiltrados = computed(() => {
    const texto = busqueda.value.toLowerCase();
    return menores.value.filter(
        (menor) => menor.nombre.toLowerCase().includes(texto) || menor.apellidos.toLowerCase().includes(texto)
    );
});

onMounted(() => {
    obtenerMenores();
});
</script>

<style scoped>
th,
td {
    vertical-align: middle;
}
</style>
