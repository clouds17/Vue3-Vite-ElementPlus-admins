<template>
    <form-drawer ref="FormDrawerRef" title="设置商品详情" destroy-on-close @close="onClose" @submit="onSubmit">
        <Editor v-model="form.content"></Editor>
    </form-drawer>
    
</template>

<script setup>
import { reactive, ref } from 'vue';
import { read_goods_api, update_goods_api } from '~/api/goods.js'
import { toast } from '~/composables/util.js';
import FormDrawer from '~/components/FormDrawer.vue';
import Editor from '~/components/Editor.vue';

const FormDrawerRef = ref(null)

const form = reactive({
    content: ''
})

const goodsId = ref(0)
const open = (row) => {
    row.contentLoading = true
    goodsId.value = row.id
    read_goods_api({
        id: row.id
    }).then(res => {
        form.content = res.content
        FormDrawerRef.value.open()
    }).finally(() => {
        row.contentLoading = false
    })
}

const emit = defineEmits(['reloadData'])

const onSubmit = () => {
    FormDrawerRef.value.showLoading()
    update_goods_api({
        id: goodsId.value,
        content: form.content
    }).then(res => {
        toast('商品详情设置成功')
        FormDrawerRef.value.close()
        emit('reloadData')
    }).finally(() => {
        FormDrawerRef.value.hideLoading()
    })
}

const onClose = () => {
    Object.assign(form, {
        content: '',
        banners: []
    })
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>

</style>