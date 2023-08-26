<!-- 权限管理 -->
<template>
    <el-card shadow="never" class=" border-0 h-full">
        <!-- 新增|刷新 -->
        <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>
        <div v-loading="isLoading" class="overflow-y-auto el-tree-container">
            <el-tree :data="tableData" :props="defaultProps" node-key="id" :default-expanded-keys="defaultExpandedKeys" >
                <template #default="{ node, data }">
                   <div class="flex items-center flex-1">
                        <el-tag class="mr-2" :type="data.menu ? 'primary' : 'info'" size="small">{{ data.menu ? '菜单' : '权限' }}</el-tag>
                        <el-icon v-if="data.icon" class="mr-2">
                            <component :is="data.icon"></component>
                        </el-icon>
                        <span>{{ node.label }}</span>
                        <div class="ml-auto mr-4">
                            <el-switch modelValue="data.status" :active-value="1" :inactive-value="0" @change="" class="mr-3"></el-switch>
                            <el-button type="primary" size="small" text>增加</el-button>
                            <el-button type="primary" size="small" text>修改</el-button>
                            <el-button type="primary" size="small" text>删除</el-button>
                            
                        </div>
                   </div>
                </template>
            </el-tree>
        </div>
    </el-card>
</template>

<script setup>
import TableListHeader from '~/components/TableListHeader.vue';
import { get_ruleList_api } from '~/api/rule.js';

import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'
import { ref } from 'vue';

const defaultExpandedKeys = ref([])

const {
    tableData,
    isLoading,
    getTableData
} = useInitTable({
    getTableApi: get_ruleList_api,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        defaultExpandedKeys.value = res.list.map(v => v.id)
    },
})

// 表单部分
const {
    openDrawer,
} = useManipulateTable({
    getTableData
})


const defaultProps = {
  children: 'child',
  label: 'name',
}

</script>

<style lang="scss" scoped>
.el-card {
    &:deep(.el-card__body) {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
}
.el-tree-container {
    &:deep(.el-button+.el-button) {
        margin-left: 0;
    }
    &:deep(.el-tree-node__content) {
        box-sizing: content-box;
        padding: 5px 0;
    }
}
</style>