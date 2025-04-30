import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

import { userInfo } from './store/UserInfo';

import NotFound from './views/NotFound.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/login' },
    {
        path: '/forgot-password',
        name: 'user-forgot-pass',
        component: () => import('./views/user/UserForgotPass.vue')
    },
    {
        path: '/reset-password/:id',
        name: 'user-forgot-set',
        component: () => import('./views/user/UserForgotSet.vue')
    },
    {
        path: '/register',
        name: 'user-register',
        component: () => import('./views/user/UserRegister.vue')
    },
    /////////////////////////////////////////////////////////////////////
    {
        path: '/login',
        name: 'login',
        // beforeEnter(to, from, next) {
        //     if (userInfo().isLoggedIn) next({ name: 'dashboard' });
        //     else next();
        // },
        component: () => import('./views/user/Login.vue')
    },
    {
        path: '/user',
        name: 'user',
        redirect: '/user/dashboard',
        // beforeEnter(to, from, next) {
        //     if (!userInfo().isLoggedIn) next({ name: 'login' });
        //     else next();
        // },
        component: () => import('./components/nav/NavMain.vue'),
        children: [
            //
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('./views/user/Dashboard.vue')
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('./views/user/UserProfile.vue')
            },
            {
                path: 'list',
                name: 'user-list',
                component: () => import('./views/user/UserList.vue')
            },
            {
                path: 'edit/:id',
                name: 'user-edit',
                component: () => import('./views/user/UserAddEdit.vue')
            },
            {
                path: 'add',
                name: 'user-add',
                component: () => import('./views/user/UserAddEdit.vue')
            }
            //
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
