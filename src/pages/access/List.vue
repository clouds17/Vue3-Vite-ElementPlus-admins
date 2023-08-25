<!-- 权限管理 -->
<template>
    <el-card shadow="never" class=" border-0 ">
            <!-- 新增|刷新 -->
        <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>
        <div class="overflow-y-auto">
            <el-tree 
                v-loading="isLoading"
                :data="tableData" 
                :props="defaultProps" 
                node-key="id" 
                :default-expanded-keys="defaultExpandedKeys"
            >
                <template #default="{ node, data }">
                    <div class="flex items-center w-full three-box">
                        <el-tag :type="data.menu ? '' : 'info' " size="small"  >{{ data.menu ? '菜单' : '权限' }}</el-tag>
                        <el-icon v-if="data.icon" :size="16" class=" mx-2">
                            <component :is="data.icon"></component>
                        </el-icon>
                        <span>{{ node.label }}</span>
                        <div class="ml-auto pr-5">
                            <el-switch modelValue="data.status" :active-value="1" :inactive-value="0" class="mr-4">
                            </el-switch>
                            <el-button text type="primary" size="small">修改</el-button>
                            <el-button text type="primary" size="small">增加</el-button>
                            <el-button text type="primary" size="small">删除</el-button>
                        </div>
                    </div>
                </template>
            </el-tree>
        </div>
    </el-card>
</template>

<script setup>
import TableListHeader from '~/components/TableListHeader.vue';
import { get_rule_api } from '~/api/rule.js'
import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'
import { ref } from 'vue';

// 默认展开的节点的 key 的数组
const defaultExpandedKeys = ref([])

const defaultProps = {
  children: 'child',
  label: 'name',
}

const {
    tableData,
    isLoading,
    getTableData,
    switchChange
} = useInitTable({
    getTableApi: get_rule_api,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        defaultExpandedKeys.value = res.list.map(v => v.id)
        console.log('defaultExpandedKeys.value', defaultExpandedKeys.value)
    }
})


// 表单部分
const {
    formDrawerRef,
    drawerTitle,
    formRef,
    formData,
    formRules,
    openDrawer,
    closeDrawer,
    handleSubmit,
    handleEdit
} = useManipulateTable()


console.log('tableData', tableData)
</script>

<style lang="scss" scoped>
.el-card {
    &:deep(.el-card__body) {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    &:deep(.el-tree-node__content) {
        padding: 5px 0;
        box-sizing: content-box;
    }
    .three-box {
        &:deep(.el-button+.el-button) {
            margin-left: 0;
        }
    }
}

</style>