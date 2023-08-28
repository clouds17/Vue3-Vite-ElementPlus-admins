<!-- 权限管理 -->
<template>
    <el-card shadow="never" class=" border-0 h-full">
        <!-- 新增|刷新 -->
        <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>
        <div v-loading="isLoading" class="overflow-y-auto el-tree-container">
            <el-tree :data="tableData" :props="defaultProps" node-key="id" :default-expanded-keys="defaultExpandedKeys" >
                <template #default="{ node, data }">
                   <div class="flex items-center flex-1">
                        <el-tag class="mr-2" :type="data.menu ? '' : 'info'" size="small">{{ data.menu ? '菜单' : '权限' }}</el-tag>
                        <el-icon v-if="data.icon" class="mr-2">
                            <component :is="data.icon"></component>
                        </el-icon>
                        <span>{{ node.label }}</span>
                        <div class="ml-auto mr-4">
                            <el-switch 
                                :modelValue="data.status" 
                                :active-value="1" 
                                :inactive-value="0" 
                                class="mr-3" 
                                :loading="data.isLoading"
                                @change="switchChange($event, data)"
                            ></el-switch>
                            <el-button type="primary" size="small" text @click.stop="handleEdit(data)">修改</el-button>
                            <el-button type="primary" size="small" text @click.stop="addChild(data.id)">增加</el-button>
                            <el-button type="primary" size="small" text @click.stop="handleDelete(data.id)">删除</el-button>
                        </div>
                   </div>
                </template>
            </el-tree>

        </div>
        <form-drawer :title="drawerTitle + '权限'" ref="formDrawerRef" @submit="handleSubmit" @close="closeDrawer">
            <el-form :model="formData" ref="formRef" :rules="formRules" label-width="80px" :inline="false" size="default">
                <el-form-item label="上级菜单" prop="rule_id">
                    <el-cascader 
                        placeholder="请选择上级菜单"
                        v-model="formData.rule_id" 
                        :options="ruleOptions" 
                        :props="{checkStrictly: true,emitPath: false, children: 'child',label: 'name', value: 'id' }" 
                        clearable 
                        filterable
                        @change="cascaderChange"
                    />
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="formData.menu">
                        <el-radio :label="1" border>菜单</el-radio>
                        <el-radio :label="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入权限名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="formData.menu == 1">
                    <icon-select v-model="formData.icon"></icon-select>
                </el-form-item>
                <el-form-item label="前端路由" prop="frontpath" v-if="formData.menu == 1 && formData.rule_id > 0">
                    <el-input v-model="formData.frontpath" placeholder="请输入前端路由"></el-input>
                </el-form-item>
                <el-form-item label="后端规则" prop="condition"  v-if="formData.menu == 0">
                    <el-input v-model="formData.condition" placeholder="请输入后端规则"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method"  v-if="formData.menu == 0">
                    <el-select v-model="formData.method" placeholder="请选择请求方式" clearable filterable >
                        <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="formData.order" :min="0" :max="1000"/>
                </el-form-item>
            </el-form>
            
        </form-drawer>
    </el-card>
</template>

<script setup>

import { ref } from 'vue';
import TableListHeader from '~/components/TableListHeader.vue';
import { get_ruleList_api, add_rule_api, update_rule_api, update_rule_status, delete_rule_api } from '~/api/rule.js';
import FormDrawer from "~/components/FormDrawer.vue";
import IconSelect from '~/components/IconSelect.vue';
import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'

// 默认展开的节点的 key 的数组
const defaultExpandedKeys = ref([])
const ruleOptions = ref([])

const {
    tableData,
    isLoading,
    getTableData,
    handleDelete,
    switchChange
} = useInitTable({
    getTableApi: get_ruleList_api,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        defaultExpandedKeys.value = res.list.map(v => v.id)
        ruleOptions.value = res.rules
    },
    deleteApi: delete_rule_api,
    updateStatusApi: update_rule_status
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
} = useManipulateTable({
    formData: {
        rule_id: 0,
        menu: 1,
        name: '',
        condition: '', 
        method: 'GET', 
        status: 1, 
        order: 0, 
        icon: '', 
        frontpath: ''
    },
    formRules: {},
    addApi: add_rule_api,
    updateApi: update_rule_api,
    getTableData
})


const defaultProps = {
  children: 'child',
  label: 'name',
}

const cascaderChange = (e) => {
    console.log('change', e)
}
// 添加子分类
const addChild = (id) => {
    formData.rule_id = id
    openDrawer()
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