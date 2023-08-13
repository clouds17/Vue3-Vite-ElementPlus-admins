<template>
    <el-main v-loading="isLoading">
        <div class="content">
            <p v-for="(item, index) in imageList" :key="index">{{ item.url }}</p>
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
        overflow: auto;
    }
    .paging {
        height: 50px;
        @apply flex items-center justify-center;
    }
}
</style>