<template lang="pug">
nav#sidenavAccordion.sidemenu.accordion
    .sidemenu-logo
        img.logo(src='/images/logos/logo.png', alt='logo')

    .sidemenu-nav
        //- p paco
        RouterLink.nav-link(:to='{ name: "dashboard" }', title='Dashboard')
            .nav-link-icon
                i.fas.fa-columns
            .nav-link-text Dashboard
        RouterLink.nav-link(:to='{ name: "profile" }', title='My Profile')
            .nav-link-icon
                i.fas.fa-user-circle
            .nav-link-text My Profile
        RouterLink.nav-link(:to='{ name: "user-list" }', v-if='isAdmin', title='Users')
            .nav-link-icon
                i.fas.fa-users
            .nav-link-text Users

        //- a.nav-link.collapsed(href='#', @click='collapsed[0] = !collapsed[0]', title='Configuration', v-if='isUser')
            .nav-link-icon
                i.fas.fa-cog
            .nav-link-text Configuration iu wpioudfwepoi uewpoir u
            .nav-link-icon.collapse-arrow
                i.fas.fa-angle-down
        //- BCollapse.v-collapse(:when='collapsed[0]')
            .sidemenu-nav-nested
                RouterLink.nav-link.py-1(v-if='isAdmin', :to='{ name: "error-logs" }') Competition
                RouterLink.nav-link.py-1(v-if='isAdmin', :to='{ name: "user-list" }') Disciplines
                RouterLink.nav-link.py-1(v-if='isUser', :to='{ name: "dashboard" }') Statistics
                RouterLink.nav-link.py-1(v-if='isUser', :to='{ name: "user-add" }') Unit Actions

        //- a.nav-link.collapsed(href='#', @click='collapsed[1] = !collapsed[1]', title='Configuration', v-if='isUser')
            .nav-link-icon
                i.fas.fa-cog
            .nav-link-text Configuration
            .nav-link-icon.collapse-arrow
                i.fas.fa-angle-down
        //- BCollapse.v-collapse(:when='collapsed[1]')
            .sidemenu-nav-nested
                RouterLink.nav-link.py-1(v-if='isAdmin', :to='{ name: "error-logs" }') Competition
                RouterLink.nav-link.py-1(v-if='isAdmin', :to='{ name: "user-list" }') Disciplines
                RouterLink.nav-link.py-1(v-if='isUser', :to='{ name: "dashboard" }') Statistics
                RouterLink.nav-link.py-1(v-if='isUser', :to='{ name: "user-add" }') Unit Actions

        //- RouterLink.nav-link(:to='{ name: "user-list" }', v-if='isAdmin')
        //-     .nav-link-icon
        //-         i.fas.fa-users
        //-     .nav-link-text Users
        //- RouterLink.nav-link(:to='{ name: "user-list" }', v-if='isAdmin')
        //-     .nav-link-icon
        //-         i.fas.fa-users
        //-     .nav-link-text Users

    .sidemenu-footer
        a#user-dropdown.nav-link(role='button', data-bs-toggle='dropdown', aria-expanded='false')
            .user-info(ref='elUserInfo', @click='actionMenu')
                img.role-img(v-if='roleImgUrl', :src='roleImgUrl')
                i.fas.fa-user.fa-fw(v-else)
                span {{ username }}

        ul.dropdown-menu.dropdown-menu-end.mb-1(ref='elUserDropdown', aria-labelledby='user-dropdown')
            li
                RouterLink.dropdown-item(:to='{ name: "profile" }')
                    i.fas.fa-user.fa-fw.me-1
                    span Profile
            li
                hr.dropdown-divider
            li
                a.dropdown-item.text-danger(@click.prevent='logout')
                    i.fas.fa-power-off.fa-fw.me-1
                    span Logout
        .sidemenu-sep
        NavFooter
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import NavFooter from './NavFooter.vue';
import { useUserInfo } from '@/helpers/useUserInfo';
import { userInfo } from '@/store/UserInfo';

import { createPopper, type Instance } from '@popperjs/core';

const { role, username, isAdmin, isUser } = useUserInfo();

let popperInstance: Instance | null = null;
const elUserInfo = ref<HTMLElement>();
const elUserDropdown = ref<HTMLElement>();
const collapsed = ref<boolean[]>([]);

const roleImgUrl = computed(() => {
    if (role.value) return `images/roles/role_${role.value}.png`.toLowerCase();
    else return '';
});

onMounted(() => {
    if (!elUserInfo.value || !elUserDropdown.value) return;
    popperInstance = createPopper(elUserInfo.value, elUserDropdown.value, {
        placement: 'top-start'
    });
});

function actionMenu() {
    if (!popperInstance) return;
    popperInstance.update();
    if (elUserDropdown.value) elUserDropdown.value.classList.toggle('d-block');
    // document.body.classList.toggle('sb-sidenav-toggled');
    // localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
}
function logout() {
    userInfo().logout();
}
</script>
