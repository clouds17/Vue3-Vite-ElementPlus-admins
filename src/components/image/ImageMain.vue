<template>
    <el-main v-loading="isLoading">
        <div class="content">
            <el-row :gutter="10" style="margin: 0 !important;">
                <template v-if="imageList.length > 0">
                    <el-col :span="6" :offset="0" v-for="(item, index) in imageList" :key="index" class="mb-3">
                        <el-card shadow="hover" :body-style="{ padding: '0' }" class="border-2" :class="{'border-red-500': item.checked}">
                            <div class=" relative flex">
                                <el-image 
                                    :src="item.url" 
                                    fit="cover" 
                                    :lazy="true" 
                                    class="w-full h-[150px]"
                                    :preview-src-list="imageList_arr"
                                    :initial-index="index"
                                ></el-image>
                                <p class="img-title">{{ item.name }}</p>
                            </div>
                            <div class="flex items-center justify-center p-2">
                                <el-checkbox v-if="showChecked" v-model="item.checked" @change="handleChooseChange(item)" />
                                <el-button type="primary" size="small" text @click="handle_rename(item)">重命名</el-button>
                                <el-popconfirm title="是否删除该图片?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(item.id)">
                                    <template #reference>
                                        <el-button type="primary" size="small" text >删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </el-card>
                        
                    </el-col>
                </template>
                <template v-else>
                    <div class="w-full text-3xl mt-28 flex items-center justify-center text-gray-500">
                        当前分类还没有图片，快上传吧！！！
                    </div>
                </template>
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

        <upload-file ref="uploadFileRef" :data="{image_class_id: cur_class_id}" @success="uploadSuccess" ></upload-file>

    </el-main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { get_curImageList, update_image_name, delete_image_api } from "~/api/image.js";
import { showPrompt, toast } from '~/composables/util.js';
import UploadFile from '~/components/UploadFile.vue';

defineProps({
    showChecked: {
        type: Boolean,
        default: false
    }
})

// 分页
const curPage = ref(1)
const limit = ref(15)
const total = ref(0)

const isLoading = ref(false)
// 图片数据
const imageList = ref([])
// 图片预览的图片数组
const imageList_arr = ref([])

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
        console.log('res', res)
        imageList.value = res.list

        imageList_arr.value = res.urlList
        total.value = res.totalCount
    })
    .finally(()=> {
        isLoading.value = false
    })
}
// getData() 

// 重命名
const handle_rename = (item) => {
    showPrompt('重命名', item.name)
    .then(({ value }) => {
        isLoading.value = true
        update_image_name({
            id: item.id,
            name: value
        }).then(res => {
            getData()
            toast('重命名成功')
        }).finally(() => {
            isLoading.value = false
        })
    })
}

// 删除
const handleDelete = (id) => {
    isLoading.value = true
    delete_image_api({
        ids: [id]
    }).then(res => {
        getData()
        toast('删除成功')
    }).finally(() => {
        isLoading.value = false
    })
}

const uploadFileRef = ref(null)
const openUpladFile = () => uploadFileRef.value.open()

const uploadSuccess = () => {
    toast('上传成功')
    getData(1)
}

const loadData = (id) => {
    curPage.value = 1
    cur_class_id.value = id
    getData()
}

const emit = defineEmits(['choose'])
// 选中的图片
const checkedImage = computed(() => {
    return imageList.value.filter(item => item.checked)
})
// 切换复选框
const handleChooseChange = (item) => {
    if (item.checked && checkedImage.value.length > 1) {
        item.checked = false
        
        console.log('checkedImage', checkedImage.value)
        return toast('只能选择一张图片', 'error')
    }
    emit('choose', checkedImage.value)
}
// 清空选中的复选框
const clearChooseBox = () => {
    imageList.value.forEach(item => {
        item.checked = false
    })
}

defineExpose({
    loadData,
    openUpladFile,
    clearChooseBox
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
    &:deep(.el-button+.el-button) {
        margin-left: 0;
    }
}
</style>