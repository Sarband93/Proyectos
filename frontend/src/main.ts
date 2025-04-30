import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { i18n } from './i18n';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

import { userInfo } from './store/UserInfo';

import ViewHeader from './components/nav/ViewHeader.vue';
import BLoading from './components/BLoading.vue';
import BButton from './components/BButton.vue';
import { Modal as VNModal, setDefaultProps } from 'vue-neat-modal';
import { Collapse } from 'vue-collapsed';

setDefaultProps({
    teleportTarget: '#modal'
});

async function main() {
    await userInfo().getUserData();

    app.component('ViewHeader', ViewHeader);
    app.component('BLoading', BLoading);
    app.component('BButton', BButton);
    app.component('BCollapse', Collapse);
    app.component('VNModal', VNModal);

    app.use(router);
    app.use(i18n);
    app.mount('body');
}

main();
