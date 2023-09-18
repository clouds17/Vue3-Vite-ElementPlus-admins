<template>
    <form-drawer ref="formDrawerRef" title="推荐商品" confirmText="关联" @submit="openChooseGoods">
        <el-table :data="tableData" border stripe style="width: 100%;">
            <el-table-column prop="goods_id" label="ID" width="60" align="center" />
            <el-table-column label="商品封面" align="center" style="width: 35%;min-width: 180px;" >
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="fill" :lazy="true" style="width: 64px;height: 64px;" />
                </template>
            </el-table-column>      
            <el-table-column prop="name" label="商品名称" align="center" style="width: 35%;min-width: 180px;"/>
            <el-table-column label="操作" align="center" width="100">
                <template #default="{ row }">
                    <el-popconfirm
                        width="180"
                        confirm-button-text="删除"
                        cancel-button-text="取消"
                        title="是否删除该关联商品"
                        @confirm="handleDelete(row)"
                    >
                        <template #reference>
                            <el-button type="primary" text  :loading="row.isLoading">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <choose-goods ref="chooseGoodsRef"></choose-goods>
    </form-drawer>
</template>

<script setup>
import { ref } from 'vue'
import FormDrawer from '~/components/FormDrawer.vue';
import ChooseGoods from '~/components/ChooseGoods.vue';
import { get_category_goods, delete_category_goods, set_category_goods } from '~/api/category.js';
import { toast } from '~/composables/util.js';

const formDrawerRef = ref(null)
const tableData = ref([])

const category_id = ref(null)
const open = (item) => {
    category_id.value = item.id
    item.goodsDrawerLoading =  true

    getData().then(() => formDrawerRef.value.open())
    .finally(() => item.goodsDrawerLoading =  false)
}

function getData() {
    return get_category_goods({
        category_id: category_id.value
    }).then(res => {
        console.log(res)
        tableData.value = res.map(o => {
            o.isLoading = false
            return o
        })
    })
}
// 删除
const handleDelete = (row) => {
    row.isLoading = true
    delete_category_goods({
        id: row.id
    }).then(res => {
        toast('删除成功')
        getData()
    })
}

// 打开关联商品
const chooseGoodsRef = ref(null)
const openChooseGoods = () => {
    chooseGoodsRef.value.open((goods_ids) => {
        formDrawerRef.value.showLoading()
        set_category_goods({
            category_id: category_id.value,
            goods_ids
        }).then(res => {
            getData()
            toast('关联成功')
        }).finally(() => {
            formDrawerRef.value.hideLoading()
        })
    })
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>

</style>