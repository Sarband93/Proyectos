<template lang="pug">
NavView.view-menor-add-edit(icon='fas fa-user-plus', :title='isAdd ? "Añadir menor" : "Editar menor"')
    .container
        form(@submit.prevent='guardarMenor')
            .mb-3
                label.form-label(for='nombre') Nombre
                input#nombre.form-control(type='text', v-model='menor.nombre', required)

            .mb-3
                label.form-label(for='apellidos') Apellidos
                input#apellidos.form-control(type='text', v-model='menor.apellidos', required)

            .mb-3
                label.form-label(for='edad') Fecha nacimiento
                input#edad.form-control(type='date', v-model='menor.fechaNacimiento', required)

            .mb-3
                label.form-label(for='grupo') Grupo
                select#grupo.form-select(v-model='menor.grupoId', required)
                    option(value='') -- Selecciona un grupo --
                    option(v-for='grupo in gruposDisponibles', key='_id', :value='grupo._id') {{ grupo.nombre }}
            .text-center
                button.btn.btn-primary(type='submit') Guardar menor
                button.btn.btn-secondary.ms-2(@click='volver') Cancelar
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

import { alert } from '@/helpers/Utilities';
import NavView from '@/components/nav/NavView.vue';

const route = useRoute();
const router = useRouter();

const gruposDisponibles = ref<Record<string, any>[]>([]);

const menor = ref({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    grupoId: ''
});

const isAdd = computed(() => !route.params.id);

const obtenerMenor = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/api/menores/${route.params.id}`);
        menor.value = res.data;
    } catch (error) {
        console.error('Error al cargar menor:', error);
    }
};

const guardarMenor = async () => {
    try {
        if (isAdd.value) {
            await axios.post('http://localhost:3000/api/menores', menor.value);
            alert('success', 'Menor añadido correctamente');
        } else {
            await axios.put(`http://localhost:3000/api/menores/${route.params.id}`, menor.value);
            alert('success', 'Menor actualizado');
        }
        router.push({ name: 'menores' });
    } catch (error) {
        console.error('Error al guardar menor:', error);
        alert('error', 'Error al guardar el menor.');
    }
};

const obtenerGruposDisponibles = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/grupos');
        gruposDisponibles.value = res.data;
    } catch (error) {
        console.error('Error al obtener grupos:', error);
    }
};

const volver = () => {
    router.push({ name: 'menores' });
};

onMounted(async () => {
    if (!isAdd.value) await obtenerMenor();
    await obtenerGruposDisponibles();
});
</script>

<style scoped>
label {
    font-weight: 500;
}
</style>
