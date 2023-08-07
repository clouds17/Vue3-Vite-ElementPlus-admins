import { router, addRoutes } from '~/router'
import { getToken } from '~/composables/auth'
import { toast, showFullLoading, hideFullLoading } from '~/composables/util'
import store from './store'


// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    // 显示loading
    showFullLoading()

    const token = getToken()
    if (!token && to.path != '/login') {
        toast('请先登录', 'error')
        return next({
            path: '/login'
        })
    }

    if (token && to.path == '/login') {
        toast('请勿重复登录', 'error')
        return next({
            path: from.path ? from.path : '/'
        })
    }
    
    let hasNewRouters = false
    // 如果已登录，自动获取用户信息，并存储到vuex中
    if (token) {
        let { menus } = await store.dispatch('GetInfo')
        hasNewRouters = addRoutes(menus)
    }

    // 设置页面标题
    const title = (to.meta.title ? to.meta.title + '-' : '') + '小黄的商城'
    document.title = title

    hasNewRouters ? next(to.fullPath) : next()
})

// 全局后置守卫
router.afterEach((to, from) => {
    // 隐藏loading
    hideFullLoading()

})