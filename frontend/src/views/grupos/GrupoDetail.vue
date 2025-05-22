<template lang="pug">
NavView.view-grupo-detail(icon='fas fa-users', title='Información del Grupo')
    template(#header-right)
        button.btn.btn-outline-dark.me-2(@click='volver')
            i.fas.fa-arrow-left.me-2
            | Volver
        button.btn.btn-warning(v-if='isCoordinador', @click='editarGrupo')
            i.fas.fa-pen.me-2
            | Editar

    .container.mt-4
        .card.mb-4
            .card-header.bg-info.text-white Datos del grupo
            .card-body
                p Nombre: {{ grupo?.nombre }}

        .card.mb-4
            .card-header.bg-success.text-white Habitaciones y menores asignados
            .card-body
                ul
                    li(v-for='habitacion in grupo?.habitaciones', :key='habitacion._id')
                        | {{ habitacion.identificador }}:
                        ul
                            li(v-if='habitacion.menores.length === 0') Sin menores asignados
                            li(v-for='menor in habitacion.menores', :key='menor._id')
                                | {{ menor.nombre }} {{ menor.apellidos }}

        .card.mb-4
            .card-header.bg-secondary.text-white Educadores asignados
            .card-body
                p
                    | Educador Mañana:
                    span.hover-link.ms-1(@click='verEducador(grupo?.educadorManana?._id)')
                        | {{ grupo?.educadorManana?.nombre }} {{ grupo?.educadorManana?.apellidos }}
                p
                    | Educador Tarde:
                    span.hover-link.ms-1(@click='verEducador(grupo?.educadorTarde?._id)')
                        | {{ grupo?.educadorTarde?.nombre }} {{ grupo?.educadorTarde?.apellidos }}
                p
                    | Educador Finde:
                    span.hover-link.ms-1(@click='verEducador(grupo?.educadorFinde?._id)')
                        | {{ grupo?.educadorFinde?.nombre }} {{ grupo?.educadorFinde?.apellidos }}

        .card.mb-4
            .card-header.bg-primary.text-white Menores asignados al grupo
            .card-body
                ul
                    li(v-if='grupo?.menores.length === 0') Sin menores asignados directamente
                    li(v-for='menor in grupo?.menores', :key='menor._id')
                        span.hover-link.ms-1(@click='verMenor(menor._id)')
                            | {{ menor.nombre }} {{ menor.apellidos }}
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import NavView from '@/components/nav/NavView.vue';
import { useUserInfo } from '@/helpers/useUserInfo';

interface Persona {
    _id: string;
    nombre: string;
    apellidos: string;
}

interface Habitacion {
    _id: string;
    identificador: string;
    menores: Persona[];
}

interface Grupo {
    _id: string;
    nombre: string;
    habitaciones: Habitacion[];
    menores: Persona[];
    educadorManana: Persona;
    educadorTarde: Persona;
    educadorFinde: Persona;
}

const { isCoordinador } = useUserInfo();

const route = useRoute();
const router = useRouter();

const grupo = ref<Grupo | null>(null);

const obtenerGrupo = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/api/grupos/${route.params.id}`);
        grupo.value = res.data;
    } catch (error) {
        console.error('Error al obtener grupo:', error);
    }
};

const volver = () => {
    router.push({ name: 'grupos' });
};

const editarGrupo = () => {
    router.push({ name: 'grupo-edit', params: { id: route.params.id } });
};

const verEducador = (id?: string) => {
    if (id) router.push({ name: 'educador-detail', params: { id } });
};

const verMenor = (id: string) => {
    router.push({ name: 'menor-detail', params: { id } });
};

onMounted(() => {
    obtenerGrupo();
});
</script>

<style scoped>
.card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.hover-link {
    cursor: pointer;
    color: inherit;
    transition:
        color 0.2s,
        text-decoration 0.2s;
}

.hover-link:hover {
    color: #0d6efd; /* Bootstrap primary */
    text-decoration: underline;
}
</style>
