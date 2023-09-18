<template>
    <el-card shadow="never" class=" border-0 h-full">
        <!-- 搜索 -->
        <Search :model="searchForm" @search="getTableData(1)" @reset="resetSearchForm">
            <search-item label="关键词">
                <el-input v-model="searchForm.title" clearable  placeholder="请输入管理员昵称搜索"></el-input>
            </search-item>
        </Search>
        

        <el-table :data="tableData"  stripe style="width: 100%" v-loading="isLoading">
            <el-table-column type="expand" >
                <template #default="{ row, $index }">
                    <div class="flex pl-16" >
                        <el-avatar size="default" :src="row.user.avatar" fit="fill" class="mr-3"></el-avatar>
                        <div class="flex-1">
                            <h6 class="flex items-center">
                                {{ row.user.nickname || row.user.username }}
                                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                                <el-button size="small"
                                    v-if="!textareaObj[$index].textareaEdit && !row.extra"
                                    class="ml-auto" @click.stop="openTextarea(row, $index)">回复</el-button>
                            </h6>
                            {{ row.review.data }}
                            <div class="py-2">
                                <el-image 
                                    v-for="(item, index) in row.review.image"
                                    :key="index" 
                                    :src="item" 
                                    fit="cover" :lazy="true"
                                    style="width: 100px;height: 100px;"
                                    class="rounded"    
                                ></el-image>
                            </div>
                            
                            <div v-if="textareaObj[$index].textareaEdit">
                                <el-input v-model="textareaStr" placeholder="请输入评价内容" type="textarea" :rows="2"></el-input>
                                <div class="py-2">
                                    <el-button type="primary" class="mr-2" @click="reviewMsg(row, $index)">回复</el-button>
                                    <el-button @click="textareaObj[$index].textareaEdit = false">取消</el-button>
                                </div>
                            </div>
                            <template v-else>
                                <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item, index) in row.extra" :key="index">
                                    <h6 class="flex font-bold">
                                        客服
                                        <el-button type="info" size="small" class="ml-auto" @click="openTextarea(row, $index, item.data)">修改</el-button>
                                    </h6>
                                    <p>{{ item.data }}</p>
                                </div>
                            </template>
                            
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="ID"  align="center" width="70"/>
            <el-table-column label="商品" width="300">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill" 
                            :lazy="true" style="width: 50px;height: 50px;" class="rounded"></el-image>
                        <div class="ml-2 leading-normal">
                            <h3>{{ row.goods_item?.title ?? '商品已被删除' }}</h3>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="评价信息"  >
                <template #default="{ row }">
                    <div>
                        <p>用户: {{ row.user.nickname || row.user.username }}</p>
                        <p class="flex items-center">
                            <el-rate
                                v-model="row.rating"
                                disabled
                                show-score
                                text-color="#ff9900"
                            />
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="评价时间"  align="center" />
            <el-table-column  label="是否显示" width="170" >
                <template #default="{ row }">
                    <el-switch 
                        :disabled="row.super == 1"
                        :modelValue="row.status"
                        :active-value="1"
                        :inactive-value="0"
                        :loading="row.isLoading"
                        @change="switchChange($event, row)"
                    />
                </template>
            </el-table-column>
        </el-table>

        <el-pagination 
            class=" mt-6 flex items-center justify-center"
            background 
            layout="prev, pager, next" 
            :total="totalCount" 
            :current-page="page" 
            :page-size="limit" 
            @current-change="changePage" />



    </el-card>
    
</template>

<script setup>
import { ref } from 'vue';
import { get_goods_comment_list, update_goods_comment_status, review_goods_comment } from '~/api/goods-comment.js'
import Search from '~/components/search/Search.vue'
import SearchItem from '~/components/search/SearchItem.vue'

import { useInitTable } from '~/composables/useCommonList.js'
import { toast } from '~/composables/util.js';

const textareaObj = ref([])

const {
    searchForm,
    resetSearchForm,
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
    getTableApi: get_goods_comment_list,
    searchForm: {
        title: ''
    },
    onGetListSuccess: (res) => {
        textareaObj.value = res.textareaObj || []
        tableData.value = res.list
        totalCount.value = res.totalCount
    },
    updateStatusApi: update_goods_comment_status
})


const textareaStr = ref('')
const openTextarea = (row, $index, data = '') => {
    textareaStr.value = data
    textareaObj.value[$index].textareaEdit = true
}

// 回复
const reviewMsg = (row, $index) => {
    if (textareaStr.value == ''){
        return toast('回复内容不能为空', 'error')
    }
    review_goods_comment({
        id: row.id,
        data: textareaStr.value
    }).then(res => {
        toast('回复成功')
        textareaObj.value[$index].textareaEdit = false
        getTableData()
        console.log('res', res)
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