<template lang="pug">
.container.pt-5
    .py-4.px-2.p-md-4.p-md-4.mb-4.bg-light.rounded-3
        .col-12.offset-md-3.col-md-6.offset-lg-4.col-lg-4.text-center
            img.logo(src='/images/logos/logoHJ.png')
        .h4.text-center.my-3 {{ appTitle }} / Forgot Password

        .col-12.offset-md-3.col-md-6
            .mt-2
                label.small(for='email') Email
                input#email.form-control(type='email', name='email', v-model='email', required)

            .text-center.mt-4.mb-1
                BButton.w-50(size='lg', variant='primary', :busy='loading', @click='onSubmit') Send

            .mt-3.text-center
                | Or click&nbsp;
                RouterLink(:to='{ name: "user-register" }') here
                | &nbsp;to register.

        .row
            .col-lg-6.col-xl-6.col-md-8.offset-lg-3.offset-md-2
                .alert.alert-success.alert-dismissible.fade.show(v-if='ok === 1', role='alert')
                    | {{ msg }}
                .alert.alert-danger.alert-dismissible.fade.show(v-else-if='ok === 0', role='alert')
                    | {{ msg }}

    .d-flex.justify-content-center.mt-3
        .badge(:class='badgeClass') {{ envDesc }}
        .badge.bg-secondary.ms-2 v{{ version }}
    .d-flex.justify-content-center.text-muted
        .small Copyright &copy; 2024-{{ currentYear }}
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { userInfo } from '@/store/UserInfo';
import { useEnvInfo } from '@/helpers/useEnvInfo';

const { appTitle, envDesc, badgeClass, version, currentYear } = useEnvInfo();

const loading = ref(false);
const email = ref('');
const msg = ref('');
const ok = ref(-1);

async function onSubmit(event: Event) {
    event.preventDefault();
    try {
        msg.value = '';
        loading.value = true;
        ok.value = -1;
        const response = await userInfo().forgotPassword(email.value);
        if (response.msg) {
            msg.value = response.msg;
            ok.value = response.ok;
        }
    } catch (error: any) {
        if (error.response && error.response.data) msg.value = error.response.data.message;
        else if (error.isAxiosError) msg.value = error.toJSON().message;
        msg.value = error.message;
    } finally {
        loading.value = false;
    }
}
</script>
