<template>
    <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        :collapse="$store.getters.isCollapse"
        unique-opened
        @select="handleSelect"
    >
        <template v-for="(item, index) in asideMenus" :key="index">
            <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                <template #title>
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item
                    v-for="(item2, index2) in item.child"
                    :key="index2"
                    :index="item2.frontpath">
                    <el-icon>
                        <component :is="item2.icon"></component>
                    </el-icon>
                    <span>{{item2.name}}</span>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="item.frontpath">
                <el-icon>
                    <component :is="item.icon"></component>
                </el-icon>
                <span>{{item.name}}</span>
            </el-menu-item>
        </template>
        
    </el-menu>
</template>

<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前路由路径
const defaultActive = ref(route.path)

const asideMenus = [
    {
        "name": "后台面板",
        "icon": "help",
        "child": [
            {
                "name": "主控台",
                "icon": "home-filled",
                "frontpath": "/"
            }
        ]
    },
    {
        "name": "商城管理",
        "icon": "shopping-bag",
        "child": [
            {
                "name": "商品管理",
                "icon": "shopping-cart-full",
                "frontpath": "/goods/list"
            }
        ]
    },
    {
        "name": "权限管理",
        "icon": "Avatar",
        "frontpath": "/persion/list"
    }
]

// 点击菜单转跳地址
function handleSelect(index, indexPath, item, routeResult) {
    router.push({
        path: index
    })
}

</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
    min-height: 100%;
    border: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 300px;
}


@media screen and (max-width: 1280px) {
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 250px;
    }
}
</style>