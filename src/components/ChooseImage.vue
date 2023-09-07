<template>
    <div class="flex items-center flex-wrap">
        <template v-if="modelValue">
            <el-image v-if="(typeof modelValue == 'string')" :src="modelValue" fit="cover" :lazy="true" class="border w-[100px] h-[100px] rounded mx-1 mb-2"></el-image>
            <template v-else>
                <div 
                    class="relative flex flex-wrap w-[100px] h-[100px] mx-1 mb-2" 
                    v-for="(url, index) in modelValue" 
                    :key="index">
                        <el-icon 
                            class="bg-white rounded-full text-md absolute top-[5px] right-[5px] z-10 "
                            @click="removeImage(url)"
                        ><CircleClose /></el-icon>
                        <el-image 
                            :src="url" 
                            fit="cover" 
                            :lazy="true" 
                            class="border w-[100px] h-[100px] rounded "
                        />
                </div>
                
            </template>
        </template>
        <div class="choose-image-btn mx-1 mb-2" @click="open">
            <el-icon class="text-gray-500"><Plus /></el-icon>
        </div>
    </div>
    <el-dialog
        title="选择图片"
        v-model="dialogVisible"
        width="80%"
        top="5vh"
        
    >
        <el-container class="bg-white rounded">
            <el-header>
                <el-button type="primary" @click="openDrawer">新增图片分类</el-button>
                <el-button type="warning" @click="uploadFile">上传图片</el-button>
            </el-header>
            <el-container>
                <image-aside ref="imageAsideRef" @change="aside_completed"></image-aside>
                <image-main ref="imageMainRef" :limit="limit" showChecked @choose="imageChoose"></image-main>
            </el-container>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
    
</template>

<script setup>
import { ref } from "vue";
import ImageAside from "~/components/image/ImageAside.vue";
import ImageMain from "~/components/image/ImageMain.vue";
import { toast } from '~/composables/util.js';




const imageAsideRef = ref(null)
const openDrawer = () => {
    imageAsideRef.value.openDrawer()
}

// 分类加载完成
const imageMainRef = ref(null)
const aside_completed = (id) => {
    imageMainRef.value.loadData(id)
}
const uploadFile = () => {
    imageMainRef.value.openUpladFile()
}

// dialog框打开和关闭
const dialogVisible = ref(false)

const open = () => dialogVisible.value = true
const close = () => {
    dialogVisible.value = false
    imageMainRef.value.clearChooseBox()
}

// 选中了图片
let urls = []
const imageChoose = (item) => {
    urls = item.map(v => v.url)
    console.log('选择', item)
}

const props = defineProps({
    modelValue: [String, Array],
    limit: {
        type: Number,
        default: 1
    }
})
const emit = defineEmits(['update:modelValue'])

const submit = () => {
    console.log('提交')
    if (props.limit > 1) {
        let values = [...props.modelValue, ...urls]
        if (values.length > props.limit) {
            values = values.splice(0, 9)
            toast('最多只能传9张图片', 'warning')
        }
        emit('update:modelValue', values)
    } else {
        emit('update:modelValue', urls[0] || '' )
    }
    close()
}

// 删除图片
const removeImage = (url) => emit('update:modelValue', props.modelValue.filter(u => u != url)) 

</script>

<style lang="scss" scoped>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border bg-light-100 flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}


.el-container {
    overflow: hidden;
    height: 70vh;

    .el-header {
        @apply flex items-center;
        border-bottom: 1px solid #eee;
        .el-tag:hover {
            cursor: pointer;
        }
    }

}
</style>