<template>
    <el-aside width="220px" v-loading="isLoading">
        <div class="content">
            <template v-for="(item, index) in classList" :key="index">
                <aside-list 
                    :active="activeClassId == item.id" 
                    @click="changeActiveId(item.id)"
                    @edit="editClass(item)" 
                    @delete="deleteClass(item.id)"
                >{{ item.name }}</aside-list>
            </template>
        </div>
        <div class="paging">
            <el-pagination 
                background 
                layout="prev, next" 
                :total="total" 
                :page-size="limit"
                :current-page="curPage"
                @current-change="getData"
            />
        </div>
    </el-aside>

    <form-drawer 
        ref="formDrawerRef"
        :title="drawerTitle + '图片分类'"
        destroyOnClose
        @submit="handleSubmit"
        @close="handleClose"
    >
        <el-form :model="form" ref="formRef" :rules="formRules" label-width="80px" label-position="right">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000" />
            </el-form-item>
            <el-alert  title="排序值越大越靠前" type="info" show-icon />
        </el-form>
        
    </form-drawer>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import AsideList from '~/components/image/AsideList.vue'
import { get_imageClass, add_imageClass, update_imageClass, delete_imageClass } from '~/api/imageClass.js';
import FormDrawer from '~/components/FormDrawer.vue';
import { toast } from '~/composables/util.js';

// 获取图片分类数据并渲染等数据

// 分页
const curPage = ref(1)
const limit = ref(15)
const total = ref(0)

const isLoading = ref(false)
const classList = ref([])
const activeClassId = ref(0)

// defineEmits(['  '])

// 获取分类数据
function getData(p = null) {
    if (typeof p == 'number') {
        curPage.value = p
    }
    isLoading.value = true
    get_imageClass({ 
        page: curPage.value, 
        limit: limit.value 
    })
    .then(res => {
        classList.value = res.list
        if (classList.value[0]) {
            changeActiveId(classList.value[0].id)
        }
        total.value = res.totalCount
    })
    .finally(()=> {
        isLoading.value = false
    })
}
getData() 
const emit = defineEmits(['change'])
function changeActiveId(id) {
    activeClassId.value = id
    emit('change', id)
}

// 新增图片分类

const formDrawerRef = ref(null)
// 打开抽屉
const openDrawer = () => formDrawerRef.value.open()
// 表单数据
const form = reactive({
    name: '',
    order: 50
})
// 抽屉展开的数据id
const curDrawerId = ref(0)

const drawerTitle = computed(() => curDrawerId.value ? '修改' : '新增')

// 表单验证
const formRules = {
    name: [
        { required: true, message: '图库分类名称不能为空', trigger: 'blur' }
    ]
}
// 表单ref
const formRef = ref(null)
// 提交
const handleSubmit = () => {
    console.log('formRef',formRef.value)
    formRef.value.validate((valid) => {
        if (!valid) return
        formDrawerRef.value.showLoading()

        const resultFunc = curDrawerId.value ? update_imageClass({id: curDrawerId.value, ...form}) : add_imageClass(form)

        resultFunc
        .then(res => {
            toast(drawerTitle.value + '成功')
            getData(curDrawerId.value ? null : 1)
            formDrawerRef.value.close()
        })
        .finally(() => {
            formDrawerRef.value.hideLoading()
        })
        
    })
}
// 关闭
const handleClose = () => {
    curDrawerId.value = 0
    Object.assign(form, {
        name: '',
        order: 50
    })
}

// 修改分类
const editClass = (item) => {
    curDrawerId.value = item.id
    form.name = item.name
    form.order = item.order
    openDrawer()

}
// 删除分类
const deleteClass = (id) => {
    isLoading.value = true
    delete_imageClass({ id })
    .then(res => {
        toast('删除成功')
        getData(null)
        formDrawerRef.value.close()
    })
    .finally(() => {
        isLoading.value = false
    })
}

defineExpose({
    openDrawer
})

</script>

<style lang="scss" scoped>
    .el-aside {
        padding-top: 20px;
        height: 100%;
        padding-bottom: 0px !important;
        @apply flex flex-col;
        .content {
            flex: 1;
            overflow: auto;
        }
        .paging {
            height: 50px;
            @apply flex items-center justify-center;
        }
    }
</style>