<template lang="pug">
mixin start
    .d-flex.justify-content-between.align-items-end
        label.small Start date
        select.btn.btn-sm.btn-light.p-0(v-if='withTimeCombos', v-model='selStart')
            option(value='null') Choose
            option(v-if='withTime', value='hour') 1 hour
            option(value='day') 1 day
            option(value='days') 7 days
            option(value='month') 1 month
    input.form-control.form-control-sm(:type='inputType', v-model='startLocal', :disabled='disabled')

mixin end
    .d-flex.justify-content-between.align-items-end
        label.small End date
        button.btn.btn-sm.btn-light.p-0.px-1(v-if='withTimeCombos', @click='setToday') Today
    input.form-control.form-control-sm(:type='inputType', v-model='endLocal', :disabled='disabled')

.date-time-range(v-if='column')
    .d-flex.flex-column.justify-content-center.w-100
        +start
        +end
.date-time-range.row(v-else)
    .col-12.col-md-6.mb-2
        +start
    .col-12.col-md-6.mb-2
        +end
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed, ref, watch } from 'vue';

const props = defineProps({
    column: { type: Boolean, default: false },
    withTime: { type: Boolean, default: true },
    withTimeCombos: { type: Boolean, default: true },
    disabled: { type: Boolean },
    start: { type: String },
    end: { type: String }
});
const emit = defineEmits<{
    (event: 'update:start', value: string | null): void;
    (event: 'update:end', value: string | null): void;
    (event: 'change', start: string, end: string): void;
}>();

const selStart = ref('day');
const startLocal = ref('');
const endLocal = ref('');

const inputType = computed(() => {
    return props.withTime ? 'datetime-local' : 'date';
});
function selectDate() {
    if (!endLocal.value) return;
    if (props.withTimeCombos) {
        let newStart = moment(endLocal.value);
        if (props.withTime && selStart.value === 'hour') newStart = newStart.subtract(1, 'hour');
        else if (selStart.value === 'day') newStart = newStart.subtract(1, 'day');
        else if (selStart.value === 'days') newStart = newStart.subtract(7, 'day');
        else if (selStart.value === 'month') newStart = newStart.subtract(1, 'month');
        //
        if (props.withTime) startLocal.value = newStart.format('YYYY-MM-DDTHH:mm');
        else startLocal.value = newStart.format('YYYY-MM-DD');
    }
}
function setToday() {
    if (props.withTime) endLocal.value = moment().format('YYYY-MM-DDT00:00');
    else endLocal.value = moment().format('YYYY-MM-DD');
}
function reset() {
    startLocal.value = '';
    endLocal.value = '';
}

watch(
    () => props.start,
    () => {
        startLocal.value = props.start || '';
    },
    { immediate: true }
);
watch(
    () => props.end,
    () => {
        endLocal.value = props.end || '';
    },
    { immediate: true }
);
watch(selStart, selectDate);
watch(startLocal, () => {
    if (endLocal.value === '') endLocal.value = startLocal.value;
    emit('update:start', startLocal.value);
    emit('change', startLocal.value, endLocal.value);
});
watch(endLocal, () => {
    selectDate();
    emit('update:end', endLocal.value);
    emit('change', startLocal.value, endLocal.value);
});
</script>
