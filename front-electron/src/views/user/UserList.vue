<template lang="pug">
NavView.view-user-list(icon='fas fa-users', title='Users')
    template(#header-right)
        button.btn.btn-primary.btn-sm(v-if='isCoordinador', @click='$router.push({ name: "user-add" })')
            i.fas.fa-plus
            span.ms-2 Add
    //- .view-user-list
    .container
        .card
            .card-body
                BLoading(v-if='loading')
                .table-responsive(v-else='loading')
                    table.table.table-striped
                        thead.table-light
                            tr
                                th(scope='col') Email
                                th(scope='col') Role
                                th(scope='col') Name
                                th(scope='col')
                                th(scope='col') 
                        tbody
                            tr(v-for='user in listUsers')
                                td(scope='row') {{ user.email }}
                                td(scope='row') {{ user.role }}
                                td(scope='row') {{ user.name }} {{ user.surname }}
                                td.text-end
                                    BButton(
                                        v-if='isCoordinador && !user.active',
                                        variant='primary',
                                        size='sm',
                                        @click='activateUser(user.email)',
                                        :busy='busy') Activate
                                    BButton(
                                        v-if='isCoordinador && !user.active',
                                        variant='warning',
                                        size='sm',
                                        @click='deactivateUser(user.email)',
                                        :busy='busy') Desactivate
                                td.text-end
                                    button.btn.btn-sm.fs-6(type='button', @click='editUser(user._id)')
                                        i.fas.fa-pencil-alt.text-success
                                    button.btn.btn-sm.fs-6(
                                        v-if='isCoordinador && user.email !== userEmail',
                                        type='button',
                                        @click='deleteUser(user)')
                                        i.fa.fa-trash-alt.text-danger
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';

import paths from '@/api/paths';
import router from '@/router';

import { userInfo } from '@/store/UserInfo';
import NavView from '@/components/nav/NavView.vue';

import type { TUser } from '@/helpers/types';
import { treatError, confirm, alert } from '@/helpers/Utilities';

import { useUserInfo } from '@/helpers/useUserInfo';

const { isCoordinador } = useUserInfo();

const userEmail = ref(userInfo().info.email);
const loading = ref(false);
const busy = ref(false);
const listUsers = ref([] as TUser[]);

async function loadUsers() {
    try {
        loading.value = true;
        const resp = await axios.get(paths.user.get());
        listUsers.value = resp.data;
    } catch (error) {
        treatError(error, 'Error loading users!');
    } finally {
        loading.value = false;
    }
}
function editUser(id: string) {
    router.push({ name: 'user-edit', params: { id: id } });
}

async function deleteUser(user: TUser): Promise<void> {
    const text = `<p>You are about to delete user <b>${user.email}</b>.</p>`;
    const result = await confirm(text + "You won't be able to revert this!");
    if (result.isConfirmed) {
        await axios.delete(paths.user.delete(user._id));
        loadUsers();
        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
    }
}

async function activateUser(email: string) {
    try {
        busy.value = true;
        await axios.put(paths.user.active(email));
        alert('success', 'User activated successfully.');

        loadUsers();
    } catch (error: any) {
        treatError(error);
    } finally {
        busy.value = false;
    }
}

async function deactivateUser(email: string) {
    try {
        busy.value = true;
        await axios.put(paths.user.desactivate(email));
        alert('success', 'User deactivated successfully.');
        loadUsers();
    } catch (error: any) {
        treatError(error);
    } finally {
        busy.value = false;
    }
}

onBeforeMount(loadUsers);
</script>
