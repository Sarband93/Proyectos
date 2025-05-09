<template lang="pug">
NavView.view-grupos(icon='fa fa-layer-group', title='Grupos')
    template(#header-right)
        button.btn.btn-success(@click='irANuevoGrupo') + Añadir grupo

    .container.mt-4
        table.table.table-striped.table-bordered
            thead
                tr
                    th Nombre del grupo
                    th Acciones
            tbody
                tr(v-for='grupo in grupos', :key='grupo._id')
                    td {{ grupo.nombre }}
                    td
                        button.btn.btn-sm.btn-primary(@click='verDetalles(grupo._id)') Ver
                        button.btn.btn-sm.btn-warning.ms-2(@click='editarGrupo(grupo._id)') Editar
                        button.btn.btn-sm.btn-danger.ms-2(@click='eliminarGrupo(grupo._id)') Eliminar
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import NavView from '@/components/nav/NavView.vue';

interface Grupo {
    _id: string;
    nombre: string;
}

const grupos = ref<Grupo[]>([]);
const router = useRouter();

const obtenerGrupos = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/grupos');
        grupos.value = res.data;
    } catch (error) {
        console.error('Error al obtener grupos:', error);
    }
};

const verDetalles = (id: string) => {
    router.push({ name: 'grupo-detail', params: { id } });
};

const editarGrupo = (id: string) => {
    router.push({ name: 'grupo-edit', params: { id } });
};

const eliminarGrupo = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este grupo?')) return;
    try {
        await axios.delete(`http://localhost:3000/api/grupos/${id}`);
        grupos.value = grupos.value.filter((g) => g._id !== id);
    } catch (error) {
        console.error('Error al eliminar grupo:', error);
    }
};

const irANuevoGrupo = () => {
    router.push({ name: 'grupo-add' });
};

onMounted(() => {
    obtenerGrupos();
});
</script>
