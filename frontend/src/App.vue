<template lang="pug">
#app
    .container.pt-5(v-if='loading || loadError')
        .p-2.p-md-4.mb-4.bg-light.rounded-3
            .col-12.offset-md-3.col-md-6.offset-lg-4.col-lg-4.text-center
                img.logo(src='/images/logos/logo.png')
            .h4.text-center.my-3 {{ appTitle }}

        BLoading(v-if='loading')
        .col-lg-6.offset-lg-3.text-center(v-if='loadError')
            .alert.alert-danger.my-3
                i.fas.fa-frown.fa-2x
                span.ms-2 There was an error loading the page
            button.btn.btn-danger(type='button', @click='loadConfig', :disabled='loading')
                i.fas.fa-redo-alt
                span.ms-2 Retry
        .d-flex.justify-content-center.my-3
            .text-center.text-muted.small.ms-2 v{{ version }}

    RouterView(v-else)

    #modal
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import axios, { type AxiosResponse } from 'axios';

import paths from '@/api/paths';

import { userInfo } from '@/store/UserInfo';
import { envInfo } from '@/store/EnvInfo';
import { useEnvInfo } from '@/helpers/useEnvInfo';

import router from './router';

const { appTitle, version, info } = useEnvInfo();

const loading = ref(true);
const loadError = ref(false);
const interval = ref('' as any);

const isLoggedIn = computed(() => {
    return userInfo().isLoggedIn;
});

async function loadConfig() {
    loading.value = true;
    loadError.value = false;
    try {
        // const resp = await axios.get(paths.config());
        // envInfo().setEnvInfo(resp.data.environment);
        // //
        // let fClass = 'environment-none';
        // if (info.value.key !== 'PROD') fClass = `environment-${info.value.color}`;
        // document.body.classList.value = '';
        // document.body.classList.add('sb-nav-fixed', fClass);
        //
    } catch (error) {
        // OJO
        loadError.value = true;
        // loadError.value = false;
    } finally {
        loading.value = false;
    }
}

watch(isLoggedIn, (logged, oldLogged) => {
    if (logged === false && oldLogged === true) {
        router.push({ name: 'login' });
    }
    if (!logged) {
        clearInterval(interval.value);
        interval.value = '';
    } else if (interval.value === '' && logged) {
        loadConfig();
    }
});

onBeforeMount(loadConfig);
</script>

<style lang="scss">
@import '../styles/styles.scss';
</style>
