import { createRouter, createWebHashHistory } from 'vue-router';


// const routes = [
//     {
//         path: '/',
//         component: () => import('~/layouts/Admin.vue'),
//         children: [
//             { 
//                 path: '/',
//                 alias: '/home',
//                 meta: {
//                     title: '后台首页'
//                 },
//                 component: () => import('~/pages/Index.vue')
//             },
//         ]
//     },
//     {
//         path: '/login',
//         meta: {
//             title: '登录页'
//         },
//         component: () => import('~/pages/Login.vue')
//     },
//     {
//         path: '/:pathMatch(.*)*',
//         component: () => import('~/pages/404.vue')
//     }
// ]

// 默认路由，所有用户共享
const routes = [
    {
        path: '/',
        name: 'admin',
        component: () => import('~/layouts/Admin.vue'),
        children: [
            { 
                path: '/',
                alias: '/home',
                meta: {
                    title: '后台首页'
                },
                component: () => import('~/pages/Index.vue')
            },
        ]
    },
    {
        path: '/login',
        meta: {
            title: '登录页'
        },
        component: () => import('~/pages/Login.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('~/pages/404.vue')
    }
]


// 动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [
    { 
        path: '/category/list',
        meta: {
            title: '分类列表'
        },
        component: () => import('~/pages/category/List.vue')
    },
    { 
        path: '/goods/list',
        meta: {
            title: '商品管理'
        },
        component: () => import('~/pages/goods/List.vue')
    },
]


export const router = createRouter({
    history: createWebHashHistory(),
    routes
})


// 动态添加路由的方法

export function addRoutes(menus) {
    const addRoutesByMenus = (arr) => {
        arr.forEach(menuItem => {
            let item = asyncRoutes.find(obj => obj.path == menuItem.frontpath)
            if (item && !router.hasRoute(item.path)) {
                router.addRoute("admin", item)
            }
            if (menuItem.child && menuItem.child.length > 0) {
                addRoutesByMenus(menuItem.child)
            }
        });
    }

    addRoutesByMenus(menus)

    console.log(router.getRoutes())
}