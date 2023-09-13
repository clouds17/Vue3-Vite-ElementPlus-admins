import { ref, nextTick, computed } from 'vue'
import { 
    create_goods_skus_card,
    update_goods_skus_card, 
    delete_goods_skus_card, 
    sort_goods_skus_card,
    create_goods_skus_card_value,
    update_goods_skus_card_value,
    delete_goods_skus_card_value,
    set_goods_skus_card_value
 } from '~/api/goods.js'
import { useArrayMoveUp, useArrayMoveDown, cartesianProductOf } from '~/composables/util.js'

// 当前的商品ID
export const goodsId = ref(0)

// 规格选项列表
export const sku_card_list = ref([])
// 多规格参数值
export const sku_list = ref([])

// 初始化规格选项列表
export function initSkuCardList(res) {
    console.log('多规格', res)
    sku_card_list.value = res.goodsSkusCard.map(item => {
        item.text = item.name
        item.isLoading = false
        item.goodsSkusCardValue.map(tag => {
            tag.text = tag.value || '属性值'
            return tag
        })
        return item
    })

    sku_list.value = res.goodsSkus
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
        getTableData()
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
        getTableData()
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
        getTableData()
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
        getTableData()
    }).finally(() => {
        isLoading.value = false
    })
    
}


// 选择弹框设置规格
export function handleChooseSetGoodsSkuCard(item, options) {
    item.isLoading = true
    set_goods_skus_card_value({
        id: item.id,
        name: options.name,
        value: options.list
    }).then(res => {
        item.name = item.text = res.goods_skus_card.name
        item.goodsSkusCardValue = res.goods_skus_card_value.map(v => {
            v.text = v.value || '属性值'
            return v
        })
        getTableData()
    }).finally(() => {
        item.isLoading = false
    })
}

// 初始化规格值选项
export function initSkuCardItem(id) {
    const item = sku_card_list.value.find(item => item.id == id)
    item.loading = false
    const inputValue = ref('')
    const inputVisible = ref(false)
    const InputRef = ref(null)


    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value.input.focus()
        })
    }
    // 添加
    const handleInputConfirm = () => {
        if (inputValue.value) {
            item.loading = true
            create_goods_skus_card_value({
                goods_skus_card_id: id,
                name: item.name,
                order: 50,
                value: inputValue.value
            }).then(res => {
                item.goodsSkusCardValue.push({
                    ...res,
                    text: res.value
                })
                getTableData()
            }).finally(() => {
                item.loading = false
                resetInput()
            })
        } else {
            resetInput()
        }
        
    }
    function resetInput() {
        inputVisible.value = false
        inputValue.value = ''
    }
    // 修改
    const handleChange = (value, tag) => {
        item.loading = true
        update_goods_skus_card_value({
            id: tag.id,
            goods_skus_card_id: id,
            name: item.name,
            order: tag.order,
            value: value
        }).then(res => {
            tag.value = value
            getTableData()
        }).catch(err => {
            tag.text = tag.value
        }).finally(() => {
            item.loading = false
        })
    }

    // 删除
    const handleClose = (tag) => {
        item.loading = true
        delete_goods_skus_card_value({
            id: tag.id
        }).then(res => {
            const index = item.goodsSkusCardValue.findIndex(v => v.id == tag.id)
            if (index != -1) {
                item.goodsSkusCardValue.splice(index, 1)
            }
            getTableData()
        }).finally(() => {
            item.loading = false
        })
    }

    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        handleChange,
        handleClose,
        showInput,
        handleInputConfirm
    }
}

// 初始化表格
export function initSkuTable() {
    // 有规格值的规格选项
    const skuLables = computed(() => sku_card_list.value.filter(v => v.goodsSkusCardValue.length > 0))

    // 获取表头
    const tableThs = computed(() => {
        let length = skuLables.value.length
        return [
            {
                name: '商品规格',
                colspan: length,
                rowspan: length > 0 ? 1 : 2,
                width: ''
            },
            {
                name: '销售价',
                rowspan: 2,
                width: 90
            },
            {
                name: '市场价',
                rowspan: 2,
                width: 90
            },
            {
                name: '成本价',
                rowspan: 2,
                width: 90
            },
            {
                name: '库存',
                rowspan: 2,
                width: 90
            },
            {
                name: '体积',
                rowspan: 2,
                width: 90
            },
            {
                name: '重量',
                rowspan: 2,
                width: 90
            },
            {
                name: '编码',
                rowspan: 2,
                width: 90
            }
        ]
    })

    return {
        skuLables,
        tableThs,
        sku_list
    }
}

// 获取规格表格数据
function getTableData() {
    setTimeout(() => {
        if (sku_card_list.value.length == 0) return []

        let list = []
        sku_card_list.value.forEach(o => {
            if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
                list.push(o.goodsSkusCardValue)
            }
        })

        if (list.length == 0) {
            return []
        }

        let arr = cartesianProductOf(...list)

        console.log('arr', arr)

        // 获取之前的规格列表,将规格ID排序之后转化成字符串
        let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map(o => {
            if (!Array.isArray(o.skus)) {
                o.skus = Object.keys(o.skus).map(k => o.skus[k])
            }
            o.skusId = o.skus.sort((a, b) => a.id - b.id).map(s => s.id).join(',')
            return o
        })

        sku_list.value = []
        sku_list.value = arr.map(skus => {
            let obj = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList)
            return {
                code : obj?.code || "",
                cprice: obj?.cprice || "0.00",
                goods_id: goodsId.value,
                image: obj?.image || "",
                oprice: obj?.oprice || "0.00",
                pprice: obj?.pprice || "0.00",
                skus,
                stock: obj?.stock || 0,
                volume: obj?.volume || 0,
                weight: obj?.weight || 0
            }
        })

    }, 200);
}

function getBeforeSkuItem(skus, beforeSkuList) {
    let skusId = skus.sort((a, b) => a.id - b.id).map(s => s.id).join(',')
    return beforeSkuList.find(o => {
        console.log('o', o)
        if (skus.length > o.skus.length) {
            return skusId.indexOf(o.skusId) != -1
        }
        return o.skusId.indexOf(skusId) != -1
    })
}