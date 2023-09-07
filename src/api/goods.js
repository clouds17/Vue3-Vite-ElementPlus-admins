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
     * 批量修改商品状态
     * @param(ids, status)
     * ids: 要修改的id数组
     * status: 是否启用：0禁用1启用
     * 
     */
    UPDATE_GOODS_STATUS: '/admin/goods/changestatus',

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

}


export const get_goods_list = ({ page = 1, limit = 10, ...options }) => {
    return new Promise((resolve, reject) => {
        request(URL.GET_GOODS_LIST.replace(':page', page), 'GET', { limit, ...options })
            .then(res => {
                res.list.map(item => {
                    item.bannersLoading = false
                    item.contentLoading = false
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

export const update_goods_status = ({ ids = [], status = 0 } = { ids: [], status: 0 }) => 
    request(URL.UPDATE_GOODS_STATUS, 'POST', { ids, status })

export const read_goods_api = ({ id }) => request(URL.READ_GOODS.replace(':id', id), 'GET')

export const set_goods_banners = ({ id, banners = [] }) => request(URL.SET_GOODS_BANNERS.replace(':id', id), 'POST', { banners })

