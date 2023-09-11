<template>
    <div>
        <div v-for="(tag, index) in sku_card_item.goodsSkusCardValue" :key="index">
            {{ tag.text }}
        </div>
    </div>
</template>

<script setup>
import {
    initSkuCardItem
} from '~/composables/useSku.js'
const props = defineProps({
    id: [String, Number]
})

const sku_card_item = initSkuCardItem(props.id)
</script>

<style lang="scss" scoped>

</style>