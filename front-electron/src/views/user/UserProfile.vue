<template lang="pug">
NavView.view-user-add-edit(icon='fa fa-user', title='Profile')
    .container
        .card
            .card-body
                .mb-3
                    label.form-label(for='email') Email
                    input#email.form-control(type='text', readonly, disabled, v-model='userEmail')

                .mb-3
                    label.form-label(for='userrole') Role
                    input#userrole.form-control(type='text', readonly, disabled, v-model='userRole')

                .mb-3
                    label(for='username') Name
                    input#username.form-control(type='text', v-model='userName')

                .mb-3
                    label(for='userSurname') Surname
                    input#userSurname.form-control(type='text', v-model='userSurname')

                .input-group.mb-3
                    span.input-group-text(style='width: 50px')
                        i.fa.fa-lock.fa-lg
                    input.form-control(type='password', placeholder='Password', aria-label='Password', v-model='password')

                .input-group.mb-3
                    span.input-group-text(style='width: 50px')
                        i.fa.fa-eye-slash.fa-lg
                    input.form-control(
                        type='password',
                        placeholder='Repeat password',
                        aria-label='Password repetition',
                        v-model='password2')

            .card-footer
                .text-left.small
                    i * Re-enter password if you want to change it
                .buttons.text-end
                    button.btn.btn-secondary(@click='$router.back()')
                        span Cancel
                    button.btn.btn-primary.ms-2(@click='submitData')
                        i.fas.fa-save
                        span.ms-2 Edit
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';

import paths from '@/api/paths';

import { userInfo } from '@/store/UserInfo';
import NavView from '@/components/nav/NavView.vue';

import { treatError, alert } from '@/helpers/Utilities';

const userEmail = ref(userInfo().info.email);
const userRole = ref(userInfo().info.role);
const userName = ref(userInfo().info.name);
const userSurname = ref(userInfo().info.surname);
const password = ref('');
const password2 = ref('');

async function submitData() {
    const data = {
        name: userName.value,
        surname: userSurname.value,
        password: password.value,
        password2: password2.value
    };
    try {
        await axios.put(paths.user.edit(), data);
        alert('success', 'Your data was updated!');
    } catch (error) {
        treatError(error);
    }
}
</script>
