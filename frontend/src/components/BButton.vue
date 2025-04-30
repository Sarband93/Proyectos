<template lang="pug">
.b-overlay-wrap.position-relative.d-inline-block(:aria-busy='busy')
    button.btn.w-100(:class='finalBtnClass', @click='buttonClick', :title='onlyIcon ? text : ""')
        slot
            i(v-if='icon', :class='icon')
            span(v-if='!onlyIcon', :class='{ "ms-2": icon }') {{ text }}
            span.sr-only(v-else, :class='{ "ms-2": icon }') {{ text }}

    .b-overlay.position-absolute(v-if='busy', style='inset: 0px; z-index: 10')
        .position-absolute.bg-light.rounded-sm(style='inset: 0px; opacity: 0.85; backdrop-filter: blur(2px)')
        .position-absolute(:class='"text" + variant', style='top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%)')
            span.spinner-border.spinner-border-sm(aria-hidden='true')
</template>

<script setup lang="ts">
import { type PropType, computed } from 'vue';

const props = defineProps({
    variant: {
        type: String as PropType<'danger' | 'warning' | 'success' | 'primary' | 'secondary' | 'info'>,
        default: 'primary'
    },
    size: { type: String as PropType<'sm' | 'lg' | 'md'>, default: 'md' },
    text: { type: String, default: '' },
    outline: { type: Boolean },
    busy: { type: Boolean },
    icon: { type: String, default: '' },
    onlyIcon: { type: Boolean },
    disabled: { type: Boolean, default: false },
    btnClass: { type: String, default: '' }
});

const emit = defineEmits<{
    (event: 'click', value: MouseEvent): void;
}>();

const finalBtnClass = computed(() => {
    let size = props.size !== 'md' ? 'btn-' + props.size : '';
    if (props.disabled) size += ' disabled';
    if (props.outline) return `btn-outline-${props.variant} ${size} ${props.btnClass}`;
    return `btn-${props.variant} ${size} ${props.btnClass}`;
});

function buttonClick(ev: MouseEvent) {
    if (props.busy) return;
    emit('click', ev);
}
</script>
