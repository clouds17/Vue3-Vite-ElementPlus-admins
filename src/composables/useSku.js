import { ref } from 'vue'
import { create_goods_skus_card, update_goods_skus_card, delete_goods_skus_card, sort_goods_skus_card } from '~/api/goods.js'
import { useArrayMoveUp, useArrayMoveDown } from '~/composables/util.js'

// 当前的商品ID
export const goodsId = ref(0)

// 规格选项列表
export const sku_card_list = ref([])

// 初始化规格选项列表
export function initSkuCardList(res) {
    sku_card_list.value = res.goodsSkusCard.map(item => {
        item.text = item.name
        item.isLoading = false
        item.goodsSkusCardValue.map(tag => {
            tag.text = tag.value || '属性值'
            return tag
        })
        return item
    })
}

// 添加规格选项
export const btnLoading = ref(false)

export function addSkuCardEvent() {
    btnLoading.value = true
    create_goods_skus_card({
        goods_id: goodsId.value,
        name: "规格选项",
        order: 50,
        type: 0
    }).then(res => {
        sku_card_list.value.push({
            ...res,
            text: res.name,
            isLoading: false,
            goodsSkusCardValue: []
        })
    }).finally(() => {
        btnLoading.value = false
    })
}

// 修改规格选项
export function updateSkuCardEvent(item) {
    item.isLoading = true
    update_goods_skus_card({
        id: item.id,
        goods_id: item.goods_id,
        name: item.text,
        order: item.order,
        type: 0
    }).then(res => {
        item.name = item.text
    }).catch(err => {
        item.text = item.name
    }).finally(() => {
        item.isLoading = false
    })
}

// 删除规格选项
export function deleteSkuCardEvent(item) {
    item.isLoading = true
    delete_goods_skus_card({
        id: item.id
    }).then(res => {
        const index = sku_card_list.value.findIndex(v => v.id == item.id)
        if (index != -1) {
            sku_card_list.value.splice(index, 1)
        }
    })
}

// 排序规格选项
export const isLoading = ref(false)
export function sortCard(action, index) {
    let oList = JSON.parse(JSON.stringify(sku_card_list.value))
    let func = action == 'up' ? useArrayMoveUp : useArrayMoveDown
    // 切换
    func(oList, index)
    // 得到切换后的order和id
    let sortData = oList.map((o, i) => {
        return {
            id: o.id,
            order: i + 1
        }
    }) 
    isLoading.value = true
    sort_goods_skus_card({
        sortdata: sortData
    }).then(res => {
        func(sku_card_list.value, index)
    }).finally(() => {
        isLoading.value = false
    })
    
}

// 初始化规格值选项
export function initSkuCardItem(id) {
    return sku_card_list.value.find(item => item.id == id)
}