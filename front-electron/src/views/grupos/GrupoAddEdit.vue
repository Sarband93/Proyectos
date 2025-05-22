<template lang="pug">
NavView.view-grupo-add-edit(icon='fas fa-users', :title='isAdd ? "Añadir grupo" : "Editar grupo"')
    template(#header-right)
        button.btn.btn-outline-dark.me-2(@click='volver')
            i.fas.fa-arrow-left.me-2
            | Volver
    .container
        form(v-if='isCoordinador', @submit.prevent='guardarGrupo')
            .mb-3
                label.form-label(for='nombre') Nombre del grupo
                input#nombre.form-control(type='text', v-model='grupo.nombre', required)

            .mb-3
                label.form-label(for='descripcion') Descripción
                textarea#descripcion.form-control(v-model='grupo.descripcion', rows='3')

            .mb-3
                label.form-label(for='capacidad') Capacidad total (habitaciones o menores)
                input#capacidad.form-control(type='number', v-model='grupo.capacidad', min='0')

            .text-center
                button.btn.btn-primary(type='submit') Guardar grupo
                button.btn.btn-secondary.ms-2(@click='volver') Cancelar
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { alert } from '@/helpers/Utilities';
import NavView from '@/components/nav/NavView.vue';
import { useUserInfo } from '@/helpers/useUserInfo';

const { isCoordinador } = useUserInfo();
const route = useRoute();
const router = useRouter();

const grupo = ref({
    nombre: '',
    descripcion: '',
    capacidad: 0
});

const isAdd = computed(() => !route.params.id);

const obtenerGrupo = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/api/grupos/${route.params.id}`);
        grupo.value = res.data;
    } catch (error) {
        console.error('Error al cargar grupo:', error);
        alert('error', 'No se pudo cargar el grupo.');
    }
};

const guardarGrupo = async () => {
    try {
        if (isAdd.value) {
            await axios.post('http://localhost:3000/api/grupos', grupo.value);
            alert('success', 'Grupo creado correctamente');
        } else {
            await axios.put(`http://localhost:3000/api/grupos/${route.params.id}`, grupo.value);
            alert('success', 'Grupo actualizado correctamente');
        }
        router.push({ name: 'grupos' });
    } catch (error) {
        console.error('Error al guardar grupo:', error);
        alert('error', 'Error al guardar el grupo.');
    }
};

const volver = () => {
    router.push({ name: 'grupos' });
};

onMounted(() => {
    if (!isAdd.value) obtenerGrupo();
});
</script>

<style scoped>
label {
    font-weight: 500;
}
</style>
