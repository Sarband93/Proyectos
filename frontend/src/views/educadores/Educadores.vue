<template lang="pug">
NavView.view-educadores(icon='fas fa-chalkboard-teacher', title='Lista de educadores')
    template(#header-right)
        button.btn.btn-success(@click='irANuevoEducador') + Añadir educador

    .container
        table.table.table-bordered.table-striped.mt-3
            thead
                tr
                    th Nombre
                    th Apellidos
                    th Turno
                    th Grupo asignado
                    th Acciones
            tbody
                tr(v-for='educador in educadores', :key='educador._id')
                    td {{ educador.nombre }}
                    td {{ educador.apellidos }}
                    td {{ educador.turno }}
                    td {{ educador.grupoAsignado?.nombre || 'Sin grupo' }}
                    td
                        button.btn.btn-sm.btn-primary(@click='verEducador(educador._id)') Ver
                        button.btn.btn-sm.btn-warning.ms-2(@click='editarEducador(educador._id)') Editar
                        button.btn.btn-sm.btn-danger.ms-2(@click='eliminarEducador(educador._id)') Eliminar
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import NavView from '@/components/nav/NavView.vue';

interface Educador {
    _id: string;
    nombre: string;
    apellidos: string;
    turno: string;
    grupoAsignado?: {
        nombre: string;
    };
}

const educadores = ref<Educador[]>([]);
const router = useRouter();

const obtenerEducadores = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/educadores');
        educadores.value = res.data;
    } catch (error) {
        console.error('Error al obtener educadores:', error);
    }
};

const irANuevoEducador = () => {
    router.push({ name: 'educador-add' });
};

const verEducador = (id: string) => {
    router.push({ name: 'educador-detail', params: { id } });
};

const editarEducador = (id: string) => {
    router.push({ name: 'educador-edit', params: { id } });
};

const eliminarEducador = async (id: string) => {
    if (!confirm('¿Deseas eliminar este educador?')) return;
    try {
        await axios.delete(`http://localhost:3000/api/educadores/${id}`);
        educadores.value = educadores.value.filter((e) => e._id !== id);
    } catch (error) {
        console.error('Error al eliminar educador:', error);
    }
};

onMounted(() => {
    obtenerEducadores();
});
</script>

<style scoped>
th,
td {
    vertical-align: middle;
}
</style>
