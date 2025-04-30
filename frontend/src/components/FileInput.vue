<template lang="pug">
.file-input
    label.small Select your file...
    input.d-none(type='file', multiple='false', tabindex='-1', :accept='format', ref='fileInput', @change='handleFileChange($event)')
    .input-group
        input.form-control(type='text', placeholder='', disabled, :value='modelValue ? modelValue.name : ""')
        button.btn.btn-secondary(tabindex='0', @click='showInput')
            slot
                i.far.fa-file
                span.ms-2 Choose file
</template>

<script setup lang="ts">
import { useTemplateRef, type PropType } from 'vue';

const fileInput2 = useTemplateRef('fileInput');

const props = defineProps({
    format: { type: String, default: '.pdf' },
    modelValue: File
});

const emit = defineEmits<{ (event: 'update:modelValue', value: string | null): void }>();

function showInput() {
    fileInput2.value?.click();
}

function handleFileChange(e: any) {
    emit('update:modelValue', e.target.files[0]);
}
</script>
