<template lang="pug">
.container.pt-5
    .py-4.px-2.p-md-4.p-md-4.mb-4.bg-light.rounded-3
        .col-12.offset-md-3.col-md-6.offset-lg-4.col-lg-4.text-center
            img.logo(src='/images/logos/logo.png')
        .h4.text-center.my-3 {{ appTitle }} / Login

        .col-12.offset-md-3.col-md-6
            form(@submit.prevent='onSubmit')
                .form-floating.mb-3
                    input#inputUsername.form-control(type='text', placeholder='Email', v-model='username')
                    label(for='inputUsername') Username
                .form-floating.mb-3
                    input#inputPassword.form-control(type='password', placeholder='Password', v-model='password')
                    label(for='inputPassword') Password
                //- .form-check.mb-3
                    input#inputRememberPassword.form-check-input(type='checkbox', value='')
                    label.form-check-label(for='inputRememberPassword')
                        | Remember Password
                .d-flex.align-items-center.justify-content-between.mt-4.mb-0
                    RouterLink.small(:to='{ name: "user-forgot-pass" }') Forgot Password?
                    BButton(text='Login', variant='primary', :busy='loading', icon='fas fa-sign-in-alt')

            .mt-2.text-center
                | Or click&nbsp;
                RouterLink(:to='{ name: "user-register" }') here
                | &nbsp;to register.

    .d-flex.justify-content-center.mt-3
        .badge(:class='badgeClass') {{ envDesc }}
        .badge.bg-secondary.ms-2 v{{ version }}
    .d-flex.justify-content-center.text-muted
        .small Copyright &copy; 2024-{{ currentYear }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Swal from 'sweetalert2';

import router from '@/router';

import { userInfo } from '@/store/UserInfo';

import { useEnvInfo } from '@/helpers/useEnvInfo';

import { treatError } from '@/helpers/Utilities';
import { useUtils } from '@/helpers/useUtils';

const username = ref('');
const password = ref('');

const { loading } = useUtils();
const { appTitle, envDesc, badgeClass, version, currentYear } = useEnvInfo();

async function onSubmit() {
    try {
        loading.value = true;
        const resp = await userInfo().login(username.value, password.value);
        if (!resp.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Sorry!',
                text: resp.msg,
                position: 'center'
            });
        } else {
            router.push({ name: 'dashboard' });
        }
    } catch (error) {
        treatError(error);
    } finally {
        loading.value = false;
    }
}
</script>
