<template lang="pug">
.admin-app
    #menu-button(:class='{ show: showMenu }')
        button.btn.btn-primary.shadow(@click='toggleMenu')
            i.fas.fa-bars
    #menu-bar.pt-3.px-1(:class='{ show: showMenu, shadow: showMenu }')
        NavMenu

    #main-content
        main.p-2.p-lg-3
            RouterView
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavMenu from './NavMenu.vue';

const showMenu = ref(false);

function toggleMenu() {
    showMenu.value = !showMenu.value;
    // const menuBar = document.getElementById('menu-bar');
    // menuBar.classList.toggle('active');
}
</script>
