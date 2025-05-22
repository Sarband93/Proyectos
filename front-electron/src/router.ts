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
            },
            //
            {
                path: 'menores',
                name: 'menores',
                component: () => import('./views/menores/Menores.vue')
            },
            //
            {
                path: 'menores/add',
                name: 'menor-add',
                component: () => import('./views/menores/MenorAddEdit.vue')
            },
            //
            {
                path: 'menores/edit/:id',
                name: 'menor-edit',
                component: () => import('./views/menores/MenorAddEdit.vue')
            },
            //
            {
                path: 'menores/detail/:id',
                name: 'menor-detail',
                component: () => import('./views/menores/MenorDetail.vue')
            },
            //
            {
                path: 'educadores',
                name: 'educadores',
                component: () => import('./views/educadores/Educadores.vue')
            },
            //
            {
                path: 'educadores/detail/:id',
                name: 'educador-detail',
                component: () => import('./views/educadores/EducadorDetail.vue')
            },
            //
            {
                path: 'educadores/add',
                name: 'educador-add',
                component: () => import('./views/educadores/EducadorAddEdit.vue')
            },
            //
            {
                path: 'educador/edit/:id',
                name: 'educador-edit',
                component: () => import('./views/educadores/EducadorAddEdit.vue')
            },
            //
            {
                path: 'grupos',
                name: 'grupos',
                component: () => import('./views/grupos/Grupos.vue')
            },
            //
            {
                path: 'grupos/add',
                name: 'grupo-add',
                component: () => import('./views/grupos/GrupoAddEdit.vue')
            },
            //
            {
                path: 'grupos/edit/:id',
                name: 'grupo-edit',
                component: () => import('./views/grupos/GrupoAddEdit.vue')
            },
            //
            {
                path: 'grupos/detail/:id',
                name: 'grupo-detail',
                component: () => import('./views/grupos/GrupoDetail.vue')
            },
            //
            {
                path: 'sanciones',
                name: 'sanciones',
                component: () => import('./views/sanciones/Sanciones.vue')
            },
            //
            {
                path: 'sanciones/add',
                name: 'sancion-add',
                component: () => import('./views/sanciones/SancionAddEdit.vue')
            },
            //
            {
                path: 'sanciones/edit/:id',
                name: 'sancion-edit',
                component: () => import('./views/sanciones/SancionAddEdit.vue')
            },
            //
            {
                path: 'cuadrante',
                name: 'cuadrante',
                component: () => import('./views/cuadrante/Cuadrante.vue')
            }
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

// Protección de rutas por autenticación y rol
router.beforeEach((to, _from, next) => {
    const store = userInfo();
    const role = store.info.role;
    const isLoggedIn = !!store.info.token;

    // Rutas públicas
    const publicRoutes = ['login', 'user-register', 'user-forgot-pass', 'user-forgot-set'];
    if (publicRoutes.includes(to.name as string)) return next();

    // Rutas protegidas: necesita login
    if (!isLoggedIn) return next({ name: 'login' });

    // Rutas solo para coordinadores
    const soloCoordinador = [
        'user-list',
        'user-add',
        'user-edit',
        'grupo-add',
        'grupo-edit',
        'grupo-delete', // si existiera
        'educador-add',
        'educador-edit',
        'educadores' // si solo quieres que el coordinador vea todos
    ];

    if (soloCoordinador.includes(to.name as string) && role !== 'coordinador') {
        return next({ name: 'dashboard' });
    }

    next();
});

export default router;
