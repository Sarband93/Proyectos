import { ref, computed } from 'vue';
import axios from 'axios';
//
import paths from '@/api/paths';
import { treatError } from './Utilities';

export function useUtils() {
    const loading = ref(false);

    async function fetchSomething(onlyPartic = false) {
        try {
            loading.value = true;
            const resp = await axios.get<any[]>(paths.user.users());
            return resp.data;
        } catch (error) {
            treatError(error, 'Could not fetch nothing');
            return [];
        } finally {
            loading.value = false;
        }
    }

    // expose manages state
    return {
        loading,
        fetchSomething
    };
}
