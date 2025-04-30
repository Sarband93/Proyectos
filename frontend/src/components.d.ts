import BButton from './components/BButton.vue';
import BLoading from './components/BLoading.vue';
import ViewHeader from './components/nav/ViewHeader.vue';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        BButton: typeof BButton;
        BLoading: typeof BLoading;
        ViewHeader: typeof ViewHeader;
    }
}
