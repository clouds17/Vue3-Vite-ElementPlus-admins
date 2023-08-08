<template>
    <div class="f-tag-list">
        <el-tabs
            v-model="activeTab"
            type="card"
            class="demo-tabs"
            @tab-remove="removeTab"
            @tab-change="changeTab"
        >
            <el-tab-pane
                v-for="item in tabList"
                :key="item.path"
                :label="item.title"
                :name="item.path"
                :closable="item.path != '/'"
            ></el-tab-pane>
        </el-tabs>

        <span class="el-dropdown-span">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-icon >
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item>Action 2</el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item disabled>Action 4</el-dropdown-item>
                    <el-dropdown-item divided>Action 5</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import { useCookies } from '@vueuse/integrations/useCookies'

const { 
    activeTab,
    tabList,
    initTabList,
    changeTab,
    removeTab
 } = tagListComposition()


initTabList()

// f-tag-list总方法函数
function tagListComposition() {
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
        console.log('监听', to)
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


    return {
        activeTab,
        tabList,
        initTabList,
        changeTab,
        removeTab
    }
}
</script>

<style lang="scss" scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.f-tag-list {
    display: flex;
    overflow: hidden;
    .el-tabs {
        flex: 1;
        overflow: hidden;
        &:deep(.el-tabs__header) {
            margin: 0;
        }
        &:deep(.el-tabs__nav) {
            border: 0 !important;
        }
        &:deep(.el-tabs__item) {
            @apply bg-white mx-1 rounded;
            border: 0 !important;
            height: 32px;
            line-height: 32px;
        }
        &:deep(.el-tabs__nav-wrap.is-scrollable) {
            padding: 0 30px;
        }
        &:deep(.el-tabs__nav-next), :deep(.el-tabs__nav-prev) {
            line-height: 35px;
        }
        &:deep(.is-disabled) {
            cursor: not-allowed;
            @apply text-gray-300;
        }
    }
    .el-dropdown-span {
        width: 32px;
        height: 32px;
        margin-left: 10px;
        flex-shrink: 0;
        @apply flex items-center justify-center bg-white text-center rounded;
        .el-dropdown {
            margin-top: 3px;
        }
    }
}
</style>