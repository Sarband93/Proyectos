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

            .mb-3
                label.form-label(for='habitacion') Habitación
                select#habitacion.form-select(v-model='menor.habitacionId', required)
                    option(value='') -- Selecciona una habitación --
                    option(
                        v-for='habitacion in habitacionesFiltradas',
                        :key='habitacion._id',
                        :value='habitacion._id',
                        :disabled='!habitacion.disponible') 
                        | Habitación {{ habitacion.identificador }} - ({{ habitacion.tipo }}, {{ habitacion.menores.length }} ocupantes)
                // BOTÓN PARA LIBERAR LA HABITACION
                .mt-2(v-if='menor.habitacionId')
                    button.btn.btn-outline-danger.btn-sm(@click.prevent='liberarHabitacion')
                        i.fas.fa-door-open.me-1
                        | Liberar habitación

            .mb-3
                label.form-label(for='protocolos') Protocolos
                select#protocolos.form-select(v-model='menor.protocolosEspeciales', multiple)
                    option(value='') -- Selecciona protocolos --
                    option(v-for='protocolo in protocolosDisponibles', key='protocolo', :value='protocolo') {{ protocolo }}

                // Chips visuales
                .mt-2
                    span.badge.bg-primary.text-white.me-2.mb-2(v-for='(p, index) in menor.protocolosEspeciales', :key='index')
                        | {{ p }}
                        button.btn-close.btn-close-white.btn-sm.ms-2(@click='quitarProtocolo(index)')

            // CHECKBOX DE TUTELADO
            .mb-3
                .form-check
                    input#tutelado.form-check-input(type='checkbox', v-model='menor.tutelado')
                    label.form-check-label(for='tutelado') ¿Está tutelado?

            .mb-3
                label.form-label Dietas
                input.form-control(type='text', v-model='nuevaDieta', placeholder='Añadir dieta')
                button.btn.btn-sm.btn-outline-primary.mt-1(@click.prevent='añadirDieta') Añadir
                ul.mt-2
                    li(v-for='(dieta, i) in menor.salud.dietas', :key='i')
                        | {{ dieta }}
                        button.btn-close.ms-2(@click='quitarDieta(i)')

            .mb-3
                label.form-label Alergias
                input.form-control(type='text', v-model='nuevaAlergia', placeholder='Añadir alergia')
                button.btn.btn-sm.btn-outline-danger.mt-1(@click.prevent='añadirAlergia') Añadir
                ul.mt-2
                    li(v-for='(alergia, i) in menor.salud.alergias', :key='i')
                        | {{ alergia }}
                        button.btn-close.ms-2(@click='quitarAlergia(i)')

            .mb-3
                label.form-label Intolerancias
                input.form-control(type='text', v-model='nuevaIntolerancia', placeholder='Añadir intolerancia')
                button.btn.btn-sm.btn-outline-warning.mt-1(@click.prevent='añadirIntolerancia') Añadir
                ul.mt-2
                    li(v-for='(intolerancia, i) in menor.salud.intolerancias', :key='i')
                        | {{ intolerancia }}
                        button.btn-close.ms-2(@click='quitarIntolerancia(i)')

            .mb-3
                label.form-label Medicación
                input.form-control(type='text', v-model='nuevaMedicacion', placeholder='Añadir medicación')
                button.btn.btn-sm.btn-outline-secondary.mt-1(@click.prevent='añadirMedicacion') Añadir
                ul.mt-2
                    li(v-for='(medicacion, i) in menor.medicaciones', :key='i')
                        | {{ medicacion }}
                        button.btn-close.ms-2(@click='quitarMedicacion(i)')

            .mb-3
                .form-check
                    input#bajaDeportiva.form-check-input(type='checkbox', v-model='menor.bajaDeportiva')
                    label.form-check-label(for='bajaDeportiva') ¿Está de baja deportiva?

                // SI ESTÁ DE BAJA
                .mt-2(v-if='menor.bajaDeportiva')
                    label.form-label(for='detalleBaja', placeholder='Detalle de la baja deportiva')
                    input#detalleBaja.form-control(
                        type='text',
                        v-model='menor.detalleBajaDeportiva',
                        placeholder='Ej. No puede hacer deporte de mano')

            .mb-3
                label.form-label Apoyo educativo
                .form-check
                    input#ei.form-check-input(type='checkbox', v-model='menor.apoyoEducativo.EI')
                    label.form-check-label(for='ei') EI (Estudio Intensivo)

                .form-check
                    input#ap.form-check-input(type='checkbox', v-model='menor.apoyoEducativo.AP')
                    label.form-check-label(for='ap') AP (Apoyo)

            .mb-3
                label.form-label Estado actual
                .form-check
                    input#separacionGrupo.form-check-input(type='checkbox', v-model='menor.estado.enSeparacionGrupo')
                    label.form-check-label(for='separacionGrupo') SG

                // SI ESTÁ EN SEPARA
                .mt-2(v-if='menor.estado.enSeparacionGrupo')
                    label.form-label Fecha de finalización de la separación de grupo
                    input.form-control(type='date', v-model='menor.estado.fechaFinSeparacionGrupo', required)

                    label.form-label.mt-2 Hora de finalización
                    select.form-select(v-model='menor.estado.horaFinSeparacionGrupo', required)
                        option(value='') -- Selecciona la hora --
                        option(value='16:00') 16:00
                        option(value='00:00') 00:00

                .form-check
                    input#enDomicilio.form-check-input(type='checkbox', v-model='menor.estado.enDomicilio')
                    label.form-check-label(for='enDomicilio') Domicilio

            .text-center
                button.btn.btn-primary(type='submit') Guardar menor
                button.btn.btn-secondary.ms-2(@click='volver') Cancelar
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

import { alert } from '@/helpers/Utilities';
import NavView from '@/components/nav/NavView.vue';

const route = useRoute();
const router = useRouter();

const gruposDisponibles = ref<Record<string, any>[]>([]);

interface HabitacionConDisponibilidad {
    _id: string;
    identificador: string;
    tipo: 'individual' | 'doble';
    estado: 'vacía y limpia' | 'ocupada';
    grupoId: string;
    menores: any[];
    disponible: boolean;
}

const habitacionesDisponibles = ref<HabitacionConDisponibilidad[]>([]);

const menor = ref({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    grupoId: '',
    protocolosEspeciales: [] as string[],
    tutelado: false,
    salud: {
        dietas: [] as string[],
        alergias: [] as string[],
        intolerancias: [] as string[]
    },
    medicaciones: [] as string[],
    bajaDeportiva: false,
    detalleBajaDeportiva: '',
    apoyoEducativo: {
        EI: false,
        AP: false
    },
    estado: {
        enSeparacionGrupo: false,
        enDomicilio: false,
        fechaFinSeparacionGrupo: '',
        horaFinSeparacionGrupo: '',
        fechaFinSeparacionCompleta: ''
    },
    habitacionId: ''
});

const protocolosDisponibles = [
    'PPA',
    'OE',
    'OA',
    'Riesgo de fuga',
    'Protocolo Educador',
    'Protocolo Lavandería',
    'Llamadas Supervisadas'
];

// DIETAS
const nuevaDieta = ref('');

const añadirDieta = () => {
    if (nuevaDieta.value.trim()) {
        menor.value.salud.dietas.push(nuevaDieta.value.trim());
        nuevaDieta.value = '';
    }
};

const quitarDieta = (i: number) => {
    menor.value.salud.dietas.splice(i, 1);
};

// ALERGIAS
const nuevaAlergia = ref('');

const añadirAlergia = () => {
    if (nuevaAlergia.value.trim()) {
        menor.value.salud.alergias.push(nuevaAlergia.value.trim());
        nuevaAlergia.value = '';
    }
};

const quitarAlergia = (i: number) => {
    menor.value.salud.alergias.splice(i, 1);
};

// INTOLERANCIAS
const nuevaIntolerancia = ref('');

const añadirIntolerancia = () => {
    if (nuevaIntolerancia.value.trim()) {
        menor.value.salud.intolerancias.push(nuevaIntolerancia.value.trim());
        nuevaIntolerancia.value = '';
    }
};

const quitarIntolerancia = (i: number) => {
    menor.value.salud.intolerancias.splice(i, 1);
};

// MEDICACIONES
const nuevaMedicacion = ref('');

const añadirMedicacion = () => {
    if (nuevaMedicacion.value.trim()) {
        menor.value.medicaciones.push(nuevaMedicacion.value.trim());
        nuevaMedicacion.value = '';
    }
};

const quitarMedicacion = (i: number) => {
    menor.value.medicaciones.splice(i, 1);
};

// PROTOCOLOS
const quitarProtocolo = (index: number) => {
    menor.value.protocolosEspeciales.splice(index, 1);
};

const isAdd = computed(() => !route.params.id);

const obtenerMenor = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/api/menores/${route.params.id}`);
        menor.value = res.data;

        // traer datos de fecha y hora si tiene sancion
        const fechaCompleta = menor.value.estado?.fechaFinSeparacionCompleta;

        if (fechaCompleta) {
            const completa = new Date(fechaCompleta);

            //Asignar fecha en formato 'YYYY-MM-DD'
            menor.value.estado.fechaFinSeparacionGrupo = completa.toISOString().split('T')[0];

            // Asignar hora en formato 'HH:MM'
            menor.value.estado.horaFinSeparacionGrupo = completa.toTimeString().slice(0, 5);
        }
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

// GRUPOS
const obtenerGruposDisponibles = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/grupos');
        gruposDisponibles.value = res.data;
    } catch (error) {
        console.error('Error al obtener grupos:', error);
    }
};

// HABITACIONES

const habitacionesFiltradas = computed(() => {
    if (!menor.value.grupoId) return [];

    const grupo = gruposDisponibles.value.find((g) => g._id === menor.value.grupoId);
    if (!grupo) return [];

    const esGrupoOceania = ['Samoa', 'Fiji', 'Polinesia'].includes(grupo.nombre);

    return habitacionesDisponibles.value
        .filter((habitacion) => habitacion.grupoId?.toString() === menor.value.grupoId)
        .map((habitacion) => {
            const esDoble = habitacion.tipo === 'doble';
            const numMenores = habitacion.menores?.length || 0;

            let disponible = false;

            if (esGrupoOceania) {
                disponible = habitacion.tipo === 'individual' && habitacion.estado === 'vacía y limpia';
            } else {
                if (habitacion.tipo === 'individual' && habitacion.estado === 'vacía y limpia') {
                    disponible = true;
                }
                if (esDoble && numMenores < 2) {
                    disponible = true;
                }
            }

            return { ...habitacion, disponible };
        });
});

const obtenerHabitacionesDisponibles = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/habitaciones');
        habitacionesDisponibles.value = res.data;
        console.log('Habitaciones actualizadas:', habitacionesDisponibles.value);
    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
    }
};

watch(habitacionesDisponibles, () => {
    menor.value.habitacionId = menor.value.habitacionId;
});

// LIBERAR HABITACION
const liberarHabitacion = async () => {
    try {
        await axios.put(`http://localhost:3000/api/menores/liberar-habitacion/${route.params.id}`);
        menor.value.habitacionId = '';
        alert('success', 'Habitación liberada');
        await obtenerHabitacionesDisponibles();
    } catch (error) {
        console.error('Error al liberar habitacion:', error);
        alert('error', 'No se pudo liberar la habitación');
    }
};

const obtenerProtocolosDisponibles = async () => {
    try {
        const res = await axios.get;
    } catch (error) {}
};

const volver = () => {
    router.push({ name: 'menores' });
};

onMounted(async () => {
    if (!isAdd.value) await obtenerMenor();
    await obtenerGruposDisponibles();
    await obtenerHabitacionesDisponibles();
});
</script>

<style scoped>
label {
    font-weight: 500;
}

.badge {
    padding: 0.5em 0.75em;
    font-size: 0.85em;
    border-radius: 0.5em;
    display: inline-flex;
    align-items: center;
}
.btn-close {
    margin-left: 0.5em;
}
</style>
