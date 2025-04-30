<template lang="pug">
NavView(icon='fas fa-globe', title='Dashboard')
    .container
        .p-3.p-md-5.mb-4.bg-light.rounded-3
            .container-fluid.py-5
                h1.display-5
                    i.fa.fa-user.me-1.text-info
                    span.me-2 {{ t('greeting') }}
                    b {{ username }}!!
                .d-flex.align-items-center.mb-3
                    i.me-1 Your role is
                    .badge.bg-secondary {{ role }}

                p.col-md-8.fs-4.text-muted
                    | Using this admistration site,
                    //- i.mx-1 (a.k.a. "Back office")
                    | you will be able to test your BSDF messages and see if they are sintactically correct.

                //- .h1.display-6(v-for='(item, index) in 15')
                    i.fa.fa-trophy.me-1.text-info
                    span Championship

                //- .ms-3.d-flex.align-items-center(v-if='currUserInfo.champ.key')
                    .badge.bg-secondary {{ currUserInfo.champ.key }}
                    span.h3.ms-1 {{ currUserInfo.champ.desc }}
                //- .ms-3(v-else)
                    span.h1 No champ selected
                //- .ms-3
                    RouterLink.btn.btn-primary(:to='{ name: "champ-selection" }')
                        i.fas.fa-arrow-right
                        span.ms-2 Change
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '@/helpers/useUserInfo';
import NavView from '@/components/nav/NavView.vue';

const { t } = useI18n();
const { username, role } = useUserInfo();
</script>
