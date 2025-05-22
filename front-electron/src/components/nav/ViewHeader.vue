<template lang="pug">
.view-header
    .title-left
        .d-flex.flex-column
            .h2.title
                span.me-2.text-info(v-if='icon', :class='icon') 
                span {{ title }}
                //- span.h3.ml-1.text-muted(v-if='subtitle') {{ subtitle }}
            .d-flex.align-items-center.action-text
                .badge.badge-outline-primary.mr-1.py-1(v-if='actionText') {{ actionText }}
                p.m-0.text-info(v-if='subject') {{ subject }}
    .title-right
        slot
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    title: { type: String, required: true },
    icon: { type: String },
    action: { type: String },
    op: { type: Boolean, required: false, default: undefined },
    subject: { type: String }
});
const actionText = computed(() => {
    if (props.action) return props.action;
    if (props.op === false) return 'Add';
    if (props.op !== undefined) return 'Edit';
    return '';
});
</script>
