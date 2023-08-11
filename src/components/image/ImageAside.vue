<template>
    <el-aside width="220px" v-loading="isLoading">
        <div class="content">
            <template v-for="(item, index) in classList" :key="index">
                <aside-list :active="activeClassId == item.id">{{ item.name }}</aside-list>
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
        title="新增图片分类"
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
        </el-form>
        
    </form-drawer>
</template>

<script setup>
import { reactive, ref } from "vue";
import AsideList from '~/components/image/AsideList.vue'

import { get_imageClass } from '~/api/imageClass.js';
import FormDrawer from '~/components/FormDrawer.vue';

const {
    curPage,
    limit,
    total,
    isLoading,
    classList,
    activeClassId,
    getData
} = useGetData()

const {
    form,
    formRef,
    formRules,
    handleSubmit,
    handleClose,
    formDrawerRef,
    openDrawer
} = useAddClass()



// 获取图片分类数据并渲染等数据
function useGetData() {
    // 分页
    const curPage = ref(1)
    const limit = ref(10)
    const total = ref(0)

    const isLoading = ref(false)
    const classList = ref([])
    const activeClassId = ref(0)

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
            activeClassId.value = classList.value[0]?.id || 0

            total.value = res.totalCount
        })
        .finally(()=> {
            isLoading.value = false
        })
    }
    getData() 

    return {
        curPage,
        limit,
        total,
        isLoading,
        classList,
        activeClassId,
        getData
    }
}


// 新增图片分类
function useAddClass() {

    const formDrawerRef = ref(null)
    // 打开抽屉
    const openDrawer = () => formDrawerRef.value.open()

    

    const form = reactive({
        name: '',
        order: 50
    })

    const formRules = {
        name: [
            { required: true, message: '图库分类名称不能为空', trigger: 'blur' }
        ]
    }
    const formRef = ref(null)
    // 提交
    const handleSubmit = () => {
        console.log('formRef',formRef.value)
        formRef.value.validate((valid) => {
            if (!valid) return
            formDrawerRef.value.showLoading()

            setTimeout(() => {
                console.log('提交成功')
                formDrawerRef.value.hideLoading()
            }, 2000);
        })
    }
    // 关闭
    const handleClose = () => {
        console.log('关闭')
    }

    

    return {
        form,
        formRef,
        formRules,
        handleSubmit,
        handleClose,
        formDrawerRef,
        openDrawer
    }
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