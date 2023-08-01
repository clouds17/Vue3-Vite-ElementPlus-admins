import { createRouter, createWebHashHistory } from 'vue-router';


const routes = [
    { 
        path: '/',
        alias: '/home',
        component: () => import('~/pages/Index.vue')
    },
    {
        path: '/login',
        component: () => import('~/pages/Login.vue')
    },
    {
        path: '/about',
        component: () => import('~/pages/About.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('~/pages/404.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;