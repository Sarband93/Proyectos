<template lang="pug">
NavView.view-menor-detail(icon='fa fa-child', title='Información del menor')
    template(#header-right)
        button.btn.btn-outline-dark.me-2(@click='volver')
            i.fas.fa-arrow-left.me-2
            | Volver

        button.btn.btn-warning(@click='editarMenor')
            i.fas.fa-pen.me-2
            | Editar
    .container
        .card.mb-3
            .card-header.bg-primary.text-white Datos personales
            .card-body
                p Nombre: {{ menor?.nombre }}
                p Apellidos: {{ menor?.apellidos }}
                p Fecha de nacimiento: {{ formatoFecha(menor?.fechaNacimiento ?? '') }}
                p Edad: {{ calcularEdad(menor?.fechaNacimiento ?? '') }} años
                p Grupo: {{ menor?.grupoId?.nombre ?? 'Sin grupo' }}
                p Tutelado: {{ menor?.tutelado ? 'Sí' : 'No' }}

        .card.mb-3
            .card-header.bg-info.text-white Salud
            .card-body
                p.mb-1 Dietas:
                ul
                    li(v-for='d in menor?.salud.dietas', :key='d') {{ d || '-' }}
                p.mt-3.mb-1 Alergias:
                ul
                    li(v-for='a in menor?.salud.alergias', :key='a') {{ a || '-' }}
                p.mt-3.mb-1 Intolerancias:
                ul
                    li(v-for='i in menor?.salud.intolerancias', :key='i') {{ i || '-' }}
                p.mt-3 Baja deportiva: {{ menor?.bajaDeportiva ? 'Sí' : 'No' }}
                p(v-if='menor?.bajaDeportiva') Detalle baja: {{ menor.detalleBajaDeportiva || 'Sin detalle especificado' }}

        .card.mb-3
            .card-header.bg-warning.text-dark Protocolos
            .card-body
                p Protocolos especiales:
                ul
                    li(v-for='p in menor?.protocolosEspeciales', :key='p') {{ p || '-' }}

        .card.mb-3
            .card-header.bg-success.text-white Apoyo educativo
            .card-body
                ul
                    li(v-if='menor?.apoyoEducativo.EI') Estudio Intensivo (EI)
                    li(v-if='menor?.apoyoEducativo.AP') Apoyo Pedagógico (AP)
                    li(v-if='!menor?.apoyoEducativo.EI && !menor?.apoyoEducativo.AP') Sin apoyos educativos

        .card.mb-3
            .card-header.bg-secondary.text-white Estado actual
            .card-body
                ul
                    li(v-if='menor?.estado.enSeparacionGrupo')
                        | En Separación de Grupo (hasta {{ formatoFecha(menor?.estado.fechaFinSeparacionCompleta ?? '') }})
                    li(v-if='menor?.estado.enDomicilio') En Domicilio
                    li(v-if='!menor?.estado.enSeparacionGrupo && !menor?.estado.enDomicilio') Sin incidencias
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import axios from 'axios';
import NavView from '@/components/nav/NavView.vue';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

interface Menor {
    nombre: string;
    apellidos: string;
    fechaNacimiento: string;
    grupoId?: { nombre: string };
    tutelado: boolean;
    protocolosEspeciales: string[];
    salud: {
        dietas: string[];
        alergias: string[];
        intolerancias: string[];
    };
    medicaciones: string[];
    bajaDeportiva: boolean;
    detalleBajaDeportiva?: string;
    apoyoEducativo: {
        EI: boolean;
        AP: boolean;
    };
    estado: {
        enSeparacionGrupo: boolean;
        enDomicilio: boolean;
        fechaFinSeparacionCompleta?: string;
    };
}

const menor = ref<Menor | null>(null);

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

const volver = () => {
    router.push({ name: 'menores' });
};

const editarMenor = () => {
    router.push({ name: 'menor-edit' });
};

onMounted(() => {
    obtenerMenor();
});
</script>
