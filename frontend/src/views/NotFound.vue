<template lang="pug">
#layoutError
    #layoutError_content
        main
            .container
                .row.justify-content-center
                    .col-lg-6
                        .text-center.mt-4
                            img.mb-4.img-error(src='/images/error-404-monochrome.svg')
                            p.lead This requested URL was not found on this server.
                            button.btn.btn-primary(@click='$router.push({ name: "dashboard" })')
                                i.fas.fa-arrow-left.me-1
                                span Return to Dashboard

    #layoutError_footer
        NavFooter.full.bg-light
</template>

<script setup lang="ts">
import NavFooter from '../components/nav/NavFooter.vue';
</script>
