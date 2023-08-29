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
        component: () => import('~/layouts/Admin.vue')
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
        path: '/',
        name: '/',
        meta: {
            title: '后台首页'
        },
        component: () => import('~/pages/Index.vue')
    },
    { 
        path: '/category/list',
        name: '/category/list',
        meta: {
            title: '分类列表'
        },
        component: () => import('~/pages/category/List.vue')
    },
    { 
        path: '/goods/list',
        name: '/goods/list',
        meta: {
            title: '商品列表'
        },
        component: () => import('~/pages/goods/List.vue')
    },
    { 
        path: '/user/list',
        name: '/user/list',
        meta: {
            title: '用户列表'
        },
        component: () => import('~/pages/user/List.vue')
    },
    { 
        path: '/order/list',
        name: '/order/list',
        meta: {
            title: '订单列表'
        },
        component: () => import('~/pages/order/List.vue')
    },
    { 
        path: '/comment/list',
        name: '/comment/list',
        meta: {
            title: '评价列表'
        },
        component: () => import('~/pages/comment/List.vue')
    },
    { 
        path: '/image/list',
        name: '/image/list',
        meta: {
            title: '图库列表'
        },
        component: () => import('~/pages/image/List.vue')
    },
    { 
        path: '/notice/list',
        name: '/notice/list',
        meta: {
            title: '公告列表'
        },
        component: () => import('~/pages/notice/List.vue')
    },
    { 
        path: '/setting/base',
        name: '/setting/base',
        meta: {
            title: '配置列表'
        },
        component: () => import('~/pages/setting/Base.vue')
    },
    { 
        path: '/coupon/list',
        name: '/coupon/list',
        meta: {
            title: '优惠券'
        },
        component: () => import('~/pages/coupon/List.vue')
    },
    { 
        path: '/manager/list',
        name: '/manager/list',
        meta: {
            title: '管理员管理'
        },
        component: () => import('~/pages/manager/List.vue')
    },
    { 
        path: '/access/list',
        name: '/access/list',
        meta: {
            title: '权限管理'
        },
        component: () => import('~/pages/access/List.vue')
    },
    { 
        path: '/role/list',
        name: '/role/list',
        meta: {
            title: '角色管理'
        },
        component: () => import('~/pages/role/List.vue')
    },
    { 
        path: '/skus/list',
        name: '/skus/list',
        meta: {
            title: '规格管理'
        },
        component: () => import('~/pages/skus/List.vue')
    },
]


export const router = createRouter({
    history: createWebHashHistory(),
    routes
})


// 动态添加路由的方法
export function addRoutes(menus) {
    let hasNewRouters = false
    const addRoutersByMenus = (arr) => {
        arr.forEach(menuItem => {
            let item = asyncRoutes.find(rou => rou.path == menuItem.frontpath)
            if (item && !router.hasRoute(item.path)) {
                router.addRoute("admin", item)
                hasNewRouters = true
            }
            if (menuItem.child && menuItem.child.length > 0) {
                addRoutersByMenus(menuItem.child)
            }
        });
    }

    addRoutersByMenus(menus)

    return hasNewRouters
}



