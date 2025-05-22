<template lang="pug">
.container.pt-5
    .py-4.px-2.p-md-4.p-md-4.mb-4.bg-light.rounded-3
        .col-12.offset-md-3.col-md-6.offset-lg-4.col-lg-4.text-center
            img.logo(src='/images/logos/logoHJ.png')
        .h4.text-center.my-3 {{ appTitle }} / Register

        .col-12.offset-md-3.col-md-6
            form(@submit.prevent='onSubmit')
                .mb-2
                    label.small(for='email') Email
                    input#email.form-control(type='email', name='email', v-model='user.email', required)

                .row.mb-3
                    .mb-1.col-sm-6
                        label.small(for='password') Password
                        input#password.form-control(type='password', name='password', v-model='user.password', required)
                    .mb-1.col-sm-6
                        label.small(for='confirmPassword') Repeat the password
                        input#confirmPassword.form-control(name='confirmPassword', type='password', v-model='confirmPassword', required)

                .row
                    .mb-1.col-sm-6
                        label.small(for='givenName') Name
                        input#givenName.form-control(type='text', name='givenName', v-model='user.name', required)
                    .mb-1.col-sm-6
                        label.small(for='familyName') Surname
                        input#familyName.form-control(type='text', name='familyName', v-model='user.surname', required)

                //- .mb-2
                    label.small(for='nickName') Nickname
                    input#nickName.form-control(type='text', name='nickName', v-model='user.nickName', required)

                .d-flex.justify-content-center
                    BButton.w-50.mt-4(size='lg', variant='primary', :busy='loading', @click='onSubmit') Register

            .mt-3.text-center
                | Click&nbsp;
                RouterLink(:to='{ name: "login" }') here
                | &nbsp;if you already have an account.

    .d-flex.justify-content-center.mt-3
        .badge(:class='badgeClass') {{ envDesc }}
        .badge.bg-secondary.ms-2 v{{ version }}
    .d-flex.justify-content-center.text-muted
        .small Copyright &copy; 2024-{{ currentYear }}
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import paths from '@/api/paths';
import { alert, treatError } from '@/helpers/Utilities';
import { useEnvInfo } from '@/helpers/useEnvInfo';

const { appTitle, envDesc, badgeClass, version, currentYear } = useEnvInfo();

const router = useRouter();

const loading = ref(false);
const confirmPassword = ref('');
const user = reactive({
    name: '',
    surname: '',
    nickName: '',
    email: '',
    password: ''
});

async function onSubmit(event: Event) {
    event.preventDefault();
    try {
        if (user.password === confirmPassword.value) {
            loading.value = true;
            const newUser = {
                name: user.name,
                surname: user.surname,
                nickName: user.nickName,
                email: user.email,
                password: user.password
            };
            await axios.post(paths.auth.register(), newUser);
            alert('info', 'Administrator will validate your registration.');
            router.push({ name: 'login' });
        } else {
            alert('error', 'Password does not match!');
        }
    } catch (error: any) {
        treatError(error);
    } finally {
        loading.value = false;
    }
}
</script>
