import { defineStore } from 'pinia';

declare const __VERSION__: string;

export type Env = { color: string; desc: string; key: string };

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const envInfo = defineStore('environment', {
    state: () => {
        return { info: { color: 'dark', desc: 'Production', key: 'PROD' } as Env, version: __VERSION__ };
    },
    getters: {
        badgeClass(state) {
            switch (state.info.color) {
                case 'primary':
                    return 'bg-primary';
                case 'secondary':
                    return 'bg-secondary';
                case 'success':
                    return 'bg-success';
                case 'warning':
                    return 'bg-warning text-dark';
                case 'info':
                    return 'bg-info text-dark';
                default:
                    return 'bg-danger';
            }
        },
        appTitle(): string {
            return 'Centro de Menores';
        }
    },
    actions: {
        setEnvInfo(info: Env) {
            this.info = info;
        }
    }
});
