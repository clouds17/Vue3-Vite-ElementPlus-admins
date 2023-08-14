<template>
    <el-main v-loading="isLoading">
        <div class="content">
            <el-row :gutter="10" style="margin: 0 !important;">
                <el-col :span="6" :offset="0" v-for="(item, index) in imageList" :key="index" class="mb-3">
                    <el-card shadow="hover" :body-style="{ padding: '0' }">
                        <div class=" relative flex">
                            <el-image :src="item.url" fit="cover" :lazy="true" class="w-full h-[150px]"></el-image>
                            <p class="img-title">{{ item.name }}</p>
                        </div>
                        <div class="flex items-center justify-center p-2">
                            <el-button type="primary" size="small" text @click="">重命名</el-button>
                            <el-button type="primary" size="small" text @click="">删除</el-button>
                            
                        </div>
                    </el-card>
                    
                </el-col>
            </el-row>
            
        </div>
        <div class="paging">
            <el-pagination 
                background 
                layout="prev, pager, next"
                :total="total" 
                :page-size="limit"
                :current-page="curPage"
                @current-change="getData"
            />
        </div>
    </el-main>
</template>

<script setup>
import { ref } from 'vue';
import { get_curImageList } from "~/api/image.js";

// 分页
const curPage = ref(1)
const limit = ref(15)
const total = ref(0)

const isLoading = ref(false)
const imageList = ref([])

const cur_class_id = ref(0)

// 获取分类数据
function getData(p = null) {
    if (typeof p == 'number') {
        curPage.value = p
    }
    isLoading.value = true
    get_curImageList({ 
        id: cur_class_id.value,
        page: curPage.value, 
        limit: limit.value 
    })
    .then(res => {
        console.log('main', res)
        imageList.value = res.list
        total.value = res.totalCount
    })
    .finally(()=> {
        isLoading.value = false
    })
}
// getData() 

const loadData = (id) => {
    curPage.value = 1
    cur_class_id.value = id
    getData()
}

defineExpose({
    loadData
})

</script>

<style lang="scss" scoped>
.el-main {
    height: 100%;
    padding-bottom: 0px !important;
    @apply flex flex-col;
    .content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;

        .img-title {
            @apply text-sm bg-dark-900 bg-opacity-50 text-light-100 px-2 py-1 truncate absolute bottom-0 left-0 right-0;
        }
    }
    .paging {
        height: 50px;
        @apply flex items-center justify-center;
    }
}
</style>