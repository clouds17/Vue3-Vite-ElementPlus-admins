import { createRouter, createWebHashHistory } from 'vue-router';


const routes = [
    { 
        path: '/',
        alias: '/home',
        meta: {
            title: '后台首页'
        },
        component: () => import('~/pages/Index.vue')
    },
    {
        path: '/login',
        meta: {
            title: '登录页'
        },
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