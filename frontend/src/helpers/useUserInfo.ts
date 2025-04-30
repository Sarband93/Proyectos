import { computed } from 'vue';
import { userInfo } from '@/store/UserInfo';

export function useUserInfo() {
    const user = userInfo();

    const username = computed(() => {
        return userInfo().info.email;
    });
    const role = computed(() => {
        return userInfo().info.role;
    });

    const isAdmin = computed(() => {
        return user.isAdmin;
    });
    const isUser = computed(() => {
        return user.isUser;
    });

    // expose manages state
    return { username, role, isAdmin, isUser };
}
