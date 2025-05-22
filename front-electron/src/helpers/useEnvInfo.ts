import { computed } from 'vue';
import { envInfo } from '@/store/EnvInfo';

export function useEnvInfo() {
    const store = envInfo();
    const currentYear = new Date().getFullYear();

    const bgClass = computed(() => {
        return 'bg-dark';
    });

    const info = computed(() => {
        return store.info;
    });
    const badgeClass = computed(() => {
        return store.badgeClass;
    });
    const appTitle = computed(() => {
        return store.appTitle;
    });
    const envDesc = computed(() => {
        return store.info.desc;
    });
    const version = computed(() => {
        return store.version;
    });

    return {
        bgClass,
        info,
        badgeClass,
        appTitle,
        envDesc,
        version,
        currentYear
    };
}
