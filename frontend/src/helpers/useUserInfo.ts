import { computed } from 'vue';
import { userInfo } from '@/store/UserInfo';

export function useUserInfo() {
    const user = userInfo();

    const username = computed(() => user.info.name || user.info.email);
    const role = computed(() => user.info.role);

    const isCoordinador = computed(() => user.info.role === 'coordinador');
    const isEducador = computed(() => user.info.role === 'educador');

    return {
        username,
        role,
        isCoordinador,
        isEducador
    };
}
