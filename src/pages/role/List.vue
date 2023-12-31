<template>
    <div class="main-container">
        <el-card shadow="never" class=" border-0 h-full">
            <!-- 新增|刷新 -->
            <table-list-header @create="openDrawer" @refresh="getTableData"></table-list-header>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
                <el-table-column prop="name" label="角色列表" width="200" />
                <el-table-column prop="desc" label="角色描述" width="350" />
                <el-table-column label="角色状态" >
                    <template #default="{ row }">
                        <el-switch 
                            :modelValue="row.status"
                            :active-value="1"
                            :inactive-value="0"
                            :loading="row.isLoading"
                            @change="switchChange($event, row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="250" align="center">
                    <template #default="scope">
                        <el-button 
                            size="small" 
                            type="primary"
                            @click="openSetRoleForm(scope.row)"
                        >配置权限</el-button>
                        <el-button 
                            size="small" 
                            type="primary"
                            @click="handleEdit(scope.row)"
                        >修改</el-button>
                        <el-popconfirm  title="是否删除此公告?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button
                                    size="small"
                                    type="danger"
                                >删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination 
                class=" mt-6 flex items-center justify-center"
                background 
                layout="prev, pager, next" 
                :total="totalCount" 
                :current-page="page" 
                :page-size="10" 
                @current-change="changePage" />


            <form-drawer :title="drawerTitle + '角色'" ref="formDrawerRef" @submit="handleSubmit" @close="closeDrawer">
                <el-form :model="formData" ref="formRef" :rules="formRules" label-width="80px" :inline="false" size="default">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="formData.name" placeholder="角色名称"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="desc">
                        <el-input v-model="formData.desc" placeholder="角色描述" type="textarea" :rows="5"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-switch 
                            v-model="formData.status"
                            :active-value="1"
                            :inactive-value="0"
                        />
                    </el-form-item>
                    
                </el-form>
                
            </form-drawer>

            <!-- 配置权限 -->
            <form-drawer title="配置权限" ref="setRoleFormDrawerRef" @submit="handleSetRoleSubmit" @close="closeSetRoleDrawer">
                <el-tree-v2 
                    ref="treeV2Ref" 
                    :data="ruleList" 
                    :props="defaultProps" 
                    show-checkbox 
                    :height="treeHeight" 
                    :check-strictly="checkStrictly"
                    node-key="id" 
                    :default-expanded-keys="defaultExpandedKeys" 
                >
                    <template #default="{ data }">
                        <div class="flex items-center">
                            <el-tag :type="data.menu ? '' : 'info'" size="small"  >
                                {{ data.menu ? '菜单' : '权限' }}
                            </el-tag>
                            <span class="ml-2 text-sm">{{ data.name }}</span>
                        </div>
                    </template>
                </el-tree-v2>         
            </form-drawer>

        </el-card>
    </div>
    
</template>

<script setup>
import { ref } from 'vue'
import { toast } from '~/composables/util.js';
import { get_roleList_api, add_role_api, delete_role_api, update_role_api, update_role_status, set_role_rules } from '~/api/role.js'
import { get_ruleList_api } from '~/api/rule.js'
import FormDrawer from "~/components/FormDrawer.vue";
import TableListHeader from '~/components/TableListHeader.vue';
import { useInitTable, useManipulateTable } from '~/composables/useCommonList.js'

const {
    tableData,
    isLoading,
    page,
    limit,
    totalCount,
    getTableData,
    changePage,
    handleDelete,
    switchChange
} = useInitTable({
    getTableApi: get_roleList_api,
    deleteApi: delete_role_api,
    updateStatusApi: update_role_status
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
        name: '',
        desc: '',
        status: 1
    },
    formRules: {
        name: [
            { required: true, message: '请填写角色名称', trigger: 'blur' }
        ],
        desc: [
            { required: true, message: '请填写角色描述', trigger: 'blur' }
        ]
    },
    addApi: add_role_api,
    updateApi: update_role_api,
    getTableData
})


// 权限配置
const setRoleFormDrawerRef = ref([])


const defaultProps = {
  children: 'child',
  label: 'name',
}
// 角色权限列表
const ruleList = ref([])
const treeHeight = ref(0)
// 默认展开的节点的 key 的数组
const defaultExpandedKeys = ref([])
// 选中的角色ID
const roleId = ref(0)
const treeV2Ref = ref(null)
// 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
const checkStrictly = ref(false)
// 打开
const openSetRoleForm = (data) => {
    console.log('data.rules', data.rules)
    treeHeight.value = window.innerHeight - 200
    roleId.value = data.id
    checkStrictly.value = true
    get_ruleList_api().then(res => {
        ruleList.value = res.list
        defaultExpandedKeys.value = res.list.map(v => v.id)
        setRoleFormDrawerRef.value.open()
        // 通过 keys 设置目前勾选的节点
        setTimeout(() => {
            treeV2Ref.value.setCheckedKeys(data.rules.map(v => v.id))
            checkStrictly.value = false
        }, 100);
    })
}
// 关闭
const closeSetRoleDrawer = () => {
    ruleList.value = []
    treeHeight.value = 0
    roleId.value = 0
}



// 提交
const handleSetRoleSubmit = () => {
    setRoleFormDrawerRef.value.showLoading()
    // 返回目前被选中的节点的 key 所组成的数组
    const checkedKeys = treeV2Ref.value.getCheckedKeys()
    // 返回目前半选中的节点的 key 所组成的数组, 就是子节点没有全选的父节点
    const halfCheckedKeys = treeV2Ref.value.getHalfCheckedKeys()
    console.log('选择', [...checkedKeys, ...halfCheckedKeys])
    set_role_rules({
        id: roleId.value,
        rule_ids: [...checkedKeys, ...halfCheckedKeys]
    }).then(res => {
        setRoleFormDrawerRef.value.close()
        toast('配置权限成功')
        getTableData()
    }).finally(() => {
        setRoleFormDrawerRef.value.hideLoading()
    })

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

</style>