<template lang="pug">
NavView.view-user-add-edit(icon='fa fa-user', :title='isAdd ? "Add user" : "Edit user"')
    .container
        BLoading(v-if='loading')
        .card(v-else)
            .card-body
                .mb-3
                    label(for='email') Email
                    input#email.form-control(type='text', v-model='userEmail', disabled)

                .mb-3
                    label(for='role') Role
                    select.form-select(aria-label='Role selection', v-model='userRole')
                        option(:value='role', v-for='role in listRoles') {{ role }}

                .row
                    .col-12.col-md-6.mb-3
                        label(for='username') Name
                        input#username.form-control(type='text', v-model='userName')

                    .col-12.col-md-6.mb-3
                        label(for='userSurname') Surname
                        input#userSurname.form-control(type='text', v-model='userSurname')

                //- .input-group.mb-3
                    span.input-group-text(style='width: 50px')
                        i.fa.fa-lock.fa-lg
                    input.form-control(type='password', placeholder='Password', aria-label='Password', v-model='password')

                //- .input-group.mb-3
                    span.input-group-text(style='width: 50px')
                        i.fa.fa-eye-slash.fa-lg
                    input.form-control(
                        type='password',
                        placeholder='Repeat password',
                        aria-label='Password repetition',
                        v-model='password2')

            .card-footer
                .text-left.small
                    //- i * To change ROLE only, leave password blank
                .buttons.text-end
                    BButton(variant='secondary', @click='$router.back()', text='Cancel')
                    BButton.ms-2(variant='primary', type='submit', @click='submitData', :busy='saving', icon='fas fa-save', text='Save')
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

import paths from '@/api/paths';

import { treatError } from '@/helpers/Utilities';
import NavView from '@/components/nav/NavView.vue';

type UserData = { username: string; password: string; password2: string; role: string };

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const isAdd = ref(true);
//
const userEmail = ref('');
const userRole = ref('');
const userName = ref('');
const userSurname = ref('');
const password = ref('');
const password2 = ref('');
const listRoles = ref([] as string[]);

async function getUser(id: string) {
    try {
        const resp = await axios.get(paths.user.one(id));
        userEmail.value = resp.data.email;
        userName.value = resp.data.name;
        userSurname.value = resp.data.surname;
        userRole.value = resp.data.role;
    } catch (error) {
        treatError(error, 'Could not get user information');
    }
}
async function getAllRoles() {
    listRoles.value = ['admin', 'user'];
    // try {
    //     const resp = await axios.get(paths.user.roles());
    //     listRoles.value = resp.data;
    // } catch (error) {
    //     treatError(error, 'Could not get roles');
    // }
}
async function submitData() {
    const userData: UserData = {
        username: userName.value,
        password: password.value,
        password2: password2.value,
        role: userRole.value
    };

    try {
        saving.value = true;
        if (isAdd.value) await axios.post(paths.auth.register(), userData);
        else await axios.put(paths.user.one(route.params.id as string), userData);
        router.push({ name: 'user-list' });
    } catch (error) {
        treatError(error, 'User was not created');
    } finally {
        saving.value = false;
    }
}

onBeforeMount(async () => {
    isAdd.value = typeof route.params.id !== 'string';
    loading.value = true;
    const proms = [getAllRoles()];
    if (!isAdd.value) proms.push(getUser(route.params.id as string));
    await Promise.all(proms);
    //
    loading.value = false;
});
</script>
