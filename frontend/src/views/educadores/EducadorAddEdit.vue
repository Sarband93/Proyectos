<template lang="pug">
NavView.view-educador-add-edit(icon='fas fa-user-plus', :title='isAdd ? "Añadir educador" : "Editar educador"')
    .container
        form(@submit.prevent='guardarEducador')
            .mb-3
                label.form-label(for='nombre') Nombre
                input#nombre.form-control(type='text', v-model='educador.nombre', required)

            .mb-3
                label.form-label(for='apellidos') Apellidos
                input#apellidos.form-control(type='text', v-model='educador.apellidos', required)

            .mb-3
                label.form-label(for='turno') Turno
                select#turno.form-select(v-model='educador.turno', required)
                    option(value='') -- Selecciona turno --
                    option(value='mañana') Mañana
                    option(value='tarde') Tarde
                    option(value='noche') Noche
                    option(value='fines de semana') Fines de semana

            .mb-3
                label.form-label(for='grupo') Grupo asignado (opcional)
                select#grupo.form-select(v-model='educador.grupoAsignado')
                    option(value='') -- Sin grupo asignado --
                    option(v-for='grupo in gruposDisponibles', :key='grupo._id', :value='grupo._id') {{ grupo.nombre }}

            .text-center
                button.btn.btn-primary(type='submit') Guardar educador
                button.btn.btn-secondary.ms-2(@click='volver') Cancelar
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import NavView from '@/components/nav/NavView.vue';
import { alert } from '@/helpers/Utilities';

const route = useRoute();
const router = useRouter();

const isAdd = computed(() => !route.params.id);

const educador = ref({
    nombre: '',
    apellidos: '',
    turno: '',
    grupoAsignado: ''
});

const gruposDisponibles = ref<Record<string, any>[]>([]);

const obtenerEducador = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/api/educadores/${route.params.id}`);
        educador.value = {
            ...res.data,
            grupoAsignado: res.data.grupoAsignado?._id || ''
        };
    } catch (error) {
        console.error('Error al obtener educador:', error);
    }
};

const obtenerGrupos = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/grupos');
        gruposDisponibles.value = res.data;
    } catch (error) {
        console.error('Error al obtener grupos:', error);
    }
};

const guardarEducador = async () => {
    try {
        if (isAdd.value) {
            await axios.post('http://localhost:3000/api/educadores', educador.value);
            alert('success', 'Educador creado correctamente');
        } else {
            await axios.put(`http://localhost:3000/api/educadores/${route.params.id}`, educador.value);
            alert('success', 'Educador actualizado');
        }
        router.push({ name: 'educadores' });
    } catch (error) {
        console.error('Error al guardar educador:', error);
        alert('error', 'No se pudo guardar el educador');
    }
};

const volver = () => {
    router.push({ name: 'educadores' });
};

onMounted(async () => {
    await obtenerGrupos();
    if (!isAdd.value) await obtenerEducador();
});
</script>

<style scoped>
label {
    font-weight: 500;
}
</style>
