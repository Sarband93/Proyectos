<template lang="pug">
.view-container.shadow.rounded
    //- .card
        .card-header
    .view-container-header
        slot(name='header')
            ViewHeader.mx-3(:icon='icon', :title='title', :action='action', :op='op', :subject='subject') 
                slot(name='header-right')
    //- .card-body
    .view-container-body
        slot(name='default')
    slot(name='footer')
        //- .card-footer
</template>

<script setup lang="ts">
import ViewHeader from './ViewHeader.vue';

const props = defineProps({
    title: { type: String, default: 'title' },
    icon: { type: String },
    action: { type: String },
    op: { type: Boolean, required: false, default: undefined },
    subject: { type: String }
});
</script>
