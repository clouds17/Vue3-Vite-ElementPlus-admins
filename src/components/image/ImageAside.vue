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
</template>

<script setup>
import { ref } from "vue";
import AsideList from "./AsideList.vue";
import { get_imageClass } from '~/api/imageClass.js';

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