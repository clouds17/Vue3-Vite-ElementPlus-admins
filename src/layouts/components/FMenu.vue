<template>
    <div class="menu-container" :style="{width: $store.getters.asideWidth}">
        <el-menu
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            unique-opened
            :collapse-transition="false"
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
    </div>
    
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "vuex";

const router = useRouter()
const route = useRoute()
const store = useStore()

// 是否折叠
const isCollapse = computed(() => store.getters.asideWidth != '250px')

// 设置当前路径
store.commit('SET_MENUACTIVE', route.path)
// 获取当前默认路由路径
const defaultActive = computed(() => store.getters.defaultMenuActive)

// 获取菜单数据
const asideMenus = computed(() => store.getters.menus)

// 点击菜单转跳地址
function handleSelect(index, indexPath, item, routeResult) {
    router.push({
        path: index
    })
}

</script>

<style lang="scss" scoped>

.menu-container {
    height: 100%;
    transition: all .3s;
}
.el-menu-vertical-demo {
    height: 100%;
    border: 0;
    overflow-y: auto;
    padding-bottom: 20px;
}

.el-menu-vertical-demo:not(.el-menu--collapse){
    width: 250px;			
}

@media screen and (max-width: 1280px) {
    // .el-menu-vertical-demo:not(.el-menu--collapse) {
    //     width: 250px;
    // }
}
</style>