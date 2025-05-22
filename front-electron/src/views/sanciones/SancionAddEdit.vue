<template lang="pug">
NavView.view-sancion-add-edit(icon='fas fa-gavel', :title='isAdd ? "Nueva sanción" : "Editar sanción"')
    template(#header-right)
        button.btn.btn-outline-dark.me-2(@click='volver')
            i.fas.fa-arrow-left.me-2
            | Volver
    .container
        form(@submit.prevent='guardarSancion')
            .mb-3
                label.form-label(for='menorId') Menor
                select#menorId.form-select(v-model='sancion.menorId', required)
                    option(value='') -- Selecciona un menor --
                    option(v-for='m in menores', :value='m._id') {{ m.nombre }} {{ m.apellidos }}

            .mb-3
                label.form-label(for='educadorId') Educador
                select#educadorId.form-select(v-model='sancion.educadorId', required)
                    option(value='') -- Selecciona un educador --
                    option(v-for='e in educadores', :value='e._id') {{ e.nombre }} {{ e.apellidos }}

            .mb-3
                label.form-label Tipo
                select.form-select(v-model='sancion.tipo', required)
                    option(value='') -- Selecciona un tipo --
                    option(v-for='t in tipos', :value='t') {{ t }}

            .mb-3
                label.form-label Motivo
                select.form-select(v-model='sancion.motivo', required)
                    option(value='') -- Selecciona un motivo --
                    option(v-for='m in motivos', :value='m') {{ m }}

            .mb-3
                label.form-label Descripción
                textarea.form-control(v-model='sancion.descripcion')

            .mb-3
                label.form-label Observaciones
                textarea.form-control(v-model='sancion.observaciones')

            //- .mb-3
            //-     label.form-label Fecha
            //-     input.form-control(type='date', v-model='sancion.fecha')
            .mb-3
                label.form-label Inicio de sanción
                input.form-control(type='datetime-local', v-model='sancion.fecha', required)

            .mb-3
                label.form-label Fin de sanción
                input.form-control(type='datetime-local', v-model='sancion.fechaFin', required)
            //-

            .mb-3
                label.form-label Duración (en bloques)
                input.form-control(type='number', v-model.number='sancion.duracionBloques', min='0', step='0.5')

            .form-check.mb-3
                input#activa.form-check-input(type='checkbox', v-model='sancion.activa')
                label.form-check-label(for='activa') Activa

            .text-center
                button.btn.btn-primary(type='submit') Guardar
                button.btn.btn-secondary.ms-2(@click='volver') Cancelar
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import NavView from '@/components/nav/NavView.vue';
import { alert } from '@/helpers/Utilities';

const route = useRoute();
const router = useRouter();

const sancion = ref({
    menorId: '',
    educadorId: '',
    tipo: '',
    motivo: '',
    descripcion: '',
    observaciones: '',
    fecha: new Date().toISOString().split('T')[0],
    fechaFin: '',
    duracionBloques: 0,
    activa: true
});

const menores = ref<any[]>([]);
const educadores = ref<any[]>([]);

const tipos = ['PAR', 'SG'];
const motivos = [
    'Comedor',
    'Fuga',
    'Juego de manos',
    'Insultos',
    'Autolesión',
    'Relaciones sexuales',
    'Manipulación',
    'Apología',
    'Piercings',
    'No responsabilizarse',
    'Pertenencias',
    'Terapéutica',
    'Otros'
];

const isAdd = computed(() => !route.params.id);

const obtenerMenores = async () => {
    const res = await axios.get('http://localhost:3000/api/menores');
    menores.value = res.data;
};

const obtenerEducadores = async () => {
    const res = await axios.get('http://localhost:3000/api/educadores');
    educadores.value = res.data;
};

// const obtenerSancion = async () => {
//     const res = await axios.get(`http://localhost:3000/api/sanciones/${route.params.id}`);

//     sancion.value = res.data;

//     sancion.value.menorId = res.data.menorId?._id || '';
//     sancion.value.educadorId = res.data.educadorId?._id || '';

//     sancion.value.fecha = res.data.fecha?.split('T')[0];
// };

const obtenerSancion = async () => {
    const res = await axios.get(`http://localhost:3000/api/sanciones/${route.params.id}`);

    sancion.value = res.data;

    // Ajustar los campos que vienen poblados como objetos
    sancion.value.menorId = res.data.menorId?._id || '';
    sancion.value.educadorId = res.data.educadorId?._id || '';

    // Convertir fecha y fechaFin al formato que entiende datetime-local
    sancion.value.fecha = res.data.fecha?.slice(0, 16);
    sancion.value.fechaFin = res.data.fechaFin?.slice(0, 16);
};

const guardarSancion = async () => {
    try {
        if (isAdd.value) {
            await axios.post('http://localhost:3000/api/sanciones', sancion.value);
            alert('success', 'Sanción creada correctamente');
        } else {
            await axios.put(`http://localhost:3000/api/sanciones/${route.params.id}`, sancion.value);
            alert('success', 'Sanción actualizada correctamente');
        }
        router.push({ name: 'sanciones' });
    } catch (error) {
        console.error('Error al guardar sancion:', error);
        alert('error', 'Error al guardar la sanción');
    }
};

const volver = () => {
    router.push({ name: 'sanciones' });
};

onMounted(async () => {
    await obtenerMenores();
    await obtenerEducadores();
    if (!isAdd.value) await obtenerSancion();
});
</script>

<style scoped>
label {
    font-weight: 500;
}
</style>
