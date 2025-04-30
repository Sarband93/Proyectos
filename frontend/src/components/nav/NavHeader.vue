<template lang="pug">
nav.sb-topnav.navbar.navbar-expand.navbar-dark.shadow(:class='bgClass')
    // Navbar Brand
    RouterLink.navbar-brand.ps-3(:to='{ name: "dashboard" }')
        .d-flex.align-items-center
            img.navbar-brand-logo(src='/images/logos/b_white.png')
            span.ms-2.d-none.d-md-inline-block {{ appTitle }}

    //- Sidebar Toggle
    button#sidebarToggle.btn.btn-link.btn-sm.order-1.order-lg-0.me-4.me-lg-0(@click='actionMenu')
        i.fas.fa-bars

    //- Navbar Search
    .d-md-inline-block.form-inline.ms-auto.me-0.me-md-2.my-2.my-md-0
        //- RouterLink.d-block.align-items-center(:to='{ name: "champ-selection" }')
            .badge.rounded-pill.bg-warning.text-dark(v-if='champ')
                i.fas.fa-trophy
                span {{ champ }}
            .badge.bg-danger(v-else) NO CHAMP!

    //- Navbar
    ul.navbar-nav.ms-auto.ms-md-0.me-1.me-lg-4
        //- Environment badge
        li.nav-item.d-flex.align-items-center
            div
                .badge(:class='badgeClass', :title='info.desc') {{ info.key }}
        //- User options
        li.nav-item.dropdown
            a#navbarDropdown.nav-link.dropdown-toggle(href='#', role='button', data-bs-toggle='dropdown', aria-expanded='false')
                img.role-img(v-if='roleImgUrl', :src='roleImgUrl')
                i.fas.fa-user.fa-fw(v-else)

            ul.dropdown-menu.dropdown-menu-end(aria-labelledby='navbarDropdown')
                li
                    RouterLink.dropdown-item(:to='{ name: "profile" }')
                        i.fas.fa-user.fa-fw.me-1
                        span Profile
                //- li
                    a.dropdown-item(href='#!') Activity Log
                li
                    hr.dropdown-divider
                li
                    a.dropdown-item.text-danger(@click.prevent='logout')
                        i.fas.fa-power-off.fa-fw.me-1
                        span Logout
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { userInfo } from '@/store/UserInfo';
import { useEnvInfo } from '@/helpers/useEnvInfo';
// import { useStore } from '@/helpers/useStore';

const route = useRoute();

const { info, bgClass, badgeClass, appTitle } = useEnvInfo();

const roleImgUrl = computed(() => {
    const role = userInfo().info.role;
    if (role) return `/images/roles/role_${role}.png`.toLowerCase();
    else return '';
});

function actionMenu() {
    document.body.classList.toggle('sb-sidenav-toggled');
    // localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
}
function logout() {
    userInfo().logout();
}

watch(
    () => route.name,
    () => {
        if (window.innerWidth > 992) return;
        // this.actionMenu();
        document.body.classList.remove('sb-sidenav-toggled');
    }
);
</script>
