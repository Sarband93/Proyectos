<template lang="pug">
.container.pt-5
    .py-4.px-2.p-md-4.p-md-4.mb-4.bg-light.rounded-3
        .col-12.offset-md-3.col-md-6.offset-lg-4.col-lg-4.text-center
            img.logo(src='/images/logos/logo.png')
        .h4.text-center.my-3 {{ appTitle }} / Reset Password

        .col-12.offset-md-3.col-md-6
            .mt-2
                label.small(for='password1') Write your new password
                input#password1.form-control(type='password', name='password1', v-model='password1', required)

            .mt-2
                label.small(for='password2') Repeat the password
                input#password2.form-control(type='password', name='password2', v-model='password2', required)

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
        .small Copyright &copy; 2018-{{ currentYear }}
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { userInfo } from '@/store/UserInfo';
import { useRoute, useRouter } from 'vue-router';

import { useEnvInfo } from '@/helpers/useEnvInfo';

const { appTitle, envDesc, badgeClass, version, currentYear } = useEnvInfo();

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const password1 = ref('');
const password2 = ref('');
const msg = ref('');
const ok = ref(-1);

async function onSubmit(event: Event) {
    event.preventDefault();
    const token = route.params.id.toString();
    if (!token) return;
    try {
        msg.value = '';
        loading.value = true;
        ok.value = -1;
        if (password1.value === password2.value) {
            const response = await userInfo().setForgotPassword(token, password2.value);
            if (response.ok === 1 && response.msg) {
                msg.value = response.msg;
                ok.value = response.ok;
                if (response.ok === 1 && response.msg) {
                    msg.value = response.msg;
                    ok.value = response.ok;
                    await Swal.fire({
                        title: msg.value,
                        icon: 'success',
                        showConfirmButton: true,
                        confirmButtonText: 'Go back now!',
                        allowOutsideClick: false,
                        timer: 5000,
                        timerProgressBar: true
                    });
                    router.push({ name: 'login' });
                }
            }
        } else {
            ok.value = 0;
            msg.value = 'Password does not match!';
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
