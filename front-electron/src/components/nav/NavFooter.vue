<template lang="pug">
footer
    .footer-container
        .footer-display
            .footer-copyright
                .small Copyright &copy; 2024-{{ currentYear }}
            .footer-version
                .badge(:class='badgeClass') {{ envDesc }}
                .version.small v{{ version }}
</template>

<script setup lang="ts">
import { useEnvInfo } from '@/helpers/useEnvInfo';

const { envDesc, badgeClass, version, currentYear } = useEnvInfo();
</script>
