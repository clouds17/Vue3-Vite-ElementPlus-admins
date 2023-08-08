import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import { useCookies } from '@vueuse/integrations/useCookies'

// f-tag-list总方法函数
export function useTagList() {
    const cookie = useCookies()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const activeTab = ref(route.fullPath)
    const tabList = ref([
        {
            title: '后台首页',
            path: '/'
        }
    ])
    // 监听路由修改
    onBeforeRouteUpdate((to, from) => {
        // 设置菜单当前路径
        store.commit('SET_MENUACTIVE', to.path)
        activeTab.value = to.path
        addTabList({
            title: to.meta.title,
            path: to.path
        })
    })
    // 添加tab
    const addTabList = (tab) => {
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
        if (noTab) {
            tabList.value.push(tab)

            cookie.set('tabList', tabList.value)
        }
    }
    // 初始化tab
    const initTabList = () => {
        const tab = cookie.get('tabList')
        if (tab) {
            tabList.value = tab
        }
    }
    // 执行初始化
    initTabList()

    // 切换tab
    const changeTab = (path) => {
        activeTab.value = path
        router.push(path)
    }
    // 删除tab
    const removeTab = (closePath) => {
        let curPath = activeTab.value
        let tabs = tabList.value

        if (curPath == closePath) {
            let curIndex = tabs.findIndex(t => t.path == curPath)
            const nextTab = tabs[curIndex + 1] || tabs[curIndex - 1]
            if (nextTab) {
                changeTab(nextTab.path)
            }
        }

        tabList.value = tabs.filter(t => t.path != closePath)
        cookie.set('tabList', tabList.value)

    }

    const handleClose = (params) => {
        if (params == 'clearOther') {
            // 清除其他
            tabList.value = tabList.value.filter(t => t.path == '/' || t.path == activeTab.value)
        } else {
            // 清除所有
            changeTab('/')
            tabList.value = [{
                title: '后台首页',
                path: '/'
            }]
        }

        cookie.set('tabList', tabList.value)
    }

    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}