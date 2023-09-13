// 商品接口

import request from "~/axios.js";

const URL = {
    /**
     * 获取商品列表
     * @param(page, limit, tab, title, category_id)
     * limit: 每页条数
     * tab: 订单类型：all全部，checking审核中，saling出售中，off已下架，min_stock库存预警，delete回收站
     * title: 关键词
     * category_id: 分类id
     * 
     */
    GET_GOODS_LIST: '/admin/goods/:page',
     /**
     * 增加商品
     * @param(title, category_id, cover, desc, unit, stock, min_stock, status, stock_display, min_price, min_oprice)
     * title: 商品名称
     * category_id: 商品分类
     * cover: 商品封面
     * desc: 商品描述
     * unit: 商品单位
     * stock: 总库存
     * min_stock: 库存预警
     * status: 是否上架 0仓库1上架
     * stock_display: 库存显示 0隐藏1禁用
     * min_price: 最低销售价
     * min_oprice: 最低原价
     * 
     */
     ADD_GOODS: '/admin/goods',

    /**
     * 修改商品
     * @param(id, title, category_id, cover, desc, unit, stock, min_stock, status, stock_display, min_price, min_oprice)
     * title: 商品名称
     * category_id: 商品分类
     * cover: 商品封面
     * desc: 商品描述
     * unit: 商品单位
     * stock: 总库存
     * min_stock: 库存预警
     * status: 是否上架 0仓库1上架
     * stock_display: 库存显示 0隐藏1禁用
     * min_price: 最低销售价
     * min_oprice: 最低原价
     * 
     */
    UPDATE_GOODS: '/admin/goods/:id',

    /**
     * 批量删除商品
     * @param (ids)
     * ids: 要删除的id数组
     */
    DELETE_GOODS: '/admin/goods/delete_all',

    /**
     * 批量恢复商品
     * @param (ids)
     * ids: 要恢复的id数组
     */
    RESTORE_GOODS: '/admin/goods/restore',

    /**
     * 彻底删除商品
     * @param (ids)
     * ids: 要彻底删除的id数组
     */
    DESTROY_GOODS: '/admin/goods/destroy',

    /**
     * 批量修改商品状态
     * @param(ids, status)
     * ids: 要修改的id数组
     * status: 是否启用：0禁用1启用
     * 
     */
    UPDATE_GOODS_STATUS: '/admin/goods/changestatus',

    /**
     * 审核商品
     * @param(id, ischeck)
     * ischeck: 审核 1同意 2拒绝
     * 
     */
    CHECK_GOODS_STATUS: '/admin/goods/:id/check',

    /**
     * 查看商品资料
     * @param (id)
     */
    READ_GOODS: '/admin/goods/read/:id',

    /**
     * 设置商品轮播图
     * @param (id, banners)
     * banners: 图片链接组成的一维数组
     */
    SET_GOODS_BANNERS: '/admin/goods/banners/:id',

    // ================================ 规格的操作 ====================================

     /**
     * 更新商品规格
     * @param (id, sku_type, sku_value, goodsSkus)
     * sku_type: 规格类型：0单规格1多规格
     * sku_value: 单规格属性（sku_type=0时必填）
     * goodsSkus: 多规格属性（sku_type=1时必填）
     */
     UPDATE_GOODS_SKUS: '/admin/goods/updateskus/:id',

     /**
     * 添加商品规格选项
     * @param (goods_id, name, order, type)
     * goods_id: 商品ID
     * name: 规格名称
     * order: 排序
     * type：就写 0
     */
     CREATE_GOODS_SKUS_CARD: '/admin/goods_skus_card',

     /**
     * 修改商品规格选项
     * @param (id, goods_id, name, order, type)
     * goods_id: 商品ID
     * name: 规格名称
     * order: 排序
     * type：就写 0
     */
     UPDATE_GOODS_SKUS_CARD: '/admin/goods_skus_card/:id',

     /**
     * 删除商品规格选项
     * @param (id)
     * 
     */
     DELETE_GOODS_SKUS_CARD: '/admin/goods_skus_card/:id/delete',

     /**
     * 排序商品规格选项
     * @param (sortdata)
     * sortdata: [{ id:1,order:1 },{ id:2,order:2 }] 排序后的数据
     * 
     */
     SORT_GOODS_SKUS_CARD: '/admin/goods_skus_card/sort',


// ================================ 规格值的操作 ====================================
     
     /**
     * 添加商品规格选项的值
     * @param (goods_skus_card_id, name, order, value)
     * goods_id: 规格ID
     * name: 规格名称
     * order: 排序
     * value: 规格选项名称
     */
     CREATE_GOODS_SKUS_CARD_VALUE: '/admin/goods_skus_card_value',

     /**
     * 修改商品规格选项的值
     * @param (goods_skus_card_id, name, order, value)
     * goods_id: 规格ID
     * name: 规格名称
     * order: 排序
     * value: 规格选项名称
     */
     UPDATE_GOODS_SKUS_CARD_VALUE: '/admin/goods_skus_card_value/:id',

    /**
     * 删除商品规格选项的值
     * @param (id)
     * 
     */
    DELETE_GOODS_SKUS_CARD_VALUE: '/admin/goods_skus_card_value/:id/delete',

     /**
     * 选择设置商品规格选项和值
     * @param (id, name, value)
     * name: 规格名称
     * value: 规格选项数组
     */
     SET_GOODS_SKUS_CARD_VALUE: '/admin/goods_skus_card/:id/set',
}


export const get_goods_list = ({ page = 1, limit = 10, ...options }) => {
    return new Promise((resolve, reject) => {
        request(URL.GET_GOODS_LIST.replace(':page', page), 'GET', { limit, ...options })
            .then(res => {
                res.list.map(item => {
                    item.bannersLoading = false
                    item.contentLoading = false
                    item.skusLoading = false
                    return item
                })
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}


export const add_goods_api = (options) => 
        request(URL.ADD_GOODS, 'POST', options)

export const update_goods_api = ({id, ...options}) => 
        request(URL.UPDATE_GOODS.replace(':id', id), 'POST', options)


export const delete_goods_api = ({ ids = [] } = { ids: [] }) => request(URL.DELETE_GOODS, 'POST', { ids })

export const restore_goods_api = ({ ids = [] } = { ids: [] }) => request(URL.RESTORE_GOODS, 'POST', { ids })

export const destroy_goods_api = ({ ids = [] } = { ids: [] }) => request(URL.DESTROY_GOODS, 'POST', { ids })

export const update_goods_status = ({ ids = [], status = 0 } = { ids: [], status: 0 }) => 
    request(URL.UPDATE_GOODS_STATUS, 'POST', { ids, status })

export const check_goods_status = ({ id, ischeck = 1 }) => request(URL.CHECK_GOODS_STATUS.replace(':id', id), 'POST', { ischeck })

export const read_goods_api = ({ id }) => request(URL.READ_GOODS.replace(':id', id), 'GET')

export const set_goods_banners = ({ id, banners = [] }) => request(URL.SET_GOODS_BANNERS.replace(':id', id), 'POST', { banners })

// ================================ 规格的操作 ====================================

export const update_goods_skus = ({ id, ...options }) => request(URL.UPDATE_GOODS_SKUS.replace(':id', id), 'POST', options )

export const create_goods_skus_card = (options) => request(URL.CREATE_GOODS_SKUS_CARD, 'POST', options )

export const update_goods_skus_card = ({ id, ...options }) => request(URL.UPDATE_GOODS_SKUS_CARD.replace(':id', id), 'POST', options )

export const delete_goods_skus_card = ({ id }) => request(URL.DELETE_GOODS_SKUS_CARD.replace(':id', id), 'POST')

export const sort_goods_skus_card = ( options ) => request(URL.SORT_GOODS_SKUS_CARD, 'POST', options)

// ================================ 规格值 的操作 ====================================

export const create_goods_skus_card_value = ( options ) => request(URL.CREATE_GOODS_SKUS_CARD_VALUE, 'POST', options)

export const update_goods_skus_card_value = ({ id, ...options }) => request(URL.UPDATE_GOODS_SKUS_CARD_VALUE.replace(':id', id), 'POST', options )

export const delete_goods_skus_card_value = ({ id }) => request(URL.DELETE_GOODS_SKUS_CARD_VALUE.replace(':id', id), 'POST')

export const set_goods_skus_card_value = ({ id, name, value }) => request(URL.SET_GOODS_SKUS_CARD_VALUE.replace(':id', id), 'POST', { name, value })