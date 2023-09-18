// 商品分类接口

import request from "~/axios.js";

const URL = {
    /**
     * 获取商品分类列表
     */
    GET_CATEGORY_LIST: '/admin/category',

     /**
     * 增加商品分类
     * @param(name)
     * name: 分类名称
     * 
     */
    ADD_CATEGORY: '/admin/category',

     /**
     * 修改商品分类
     * @param(id, name)
     * name: 分类名称
     * 
     */
     UPDATE_CATEGORY: '/admin/category/:id',

    /**
     * 修改商品分类状态
     * @param(id, status)
     * status: 状态：0禁用,1启用
     * 
     */
      UPDATE_CATEGORY_STATUS: '/admin/category/:id/update_status',

    /**
     * 删除商品分类
     * @param(id)
     * 
     */
     DELETE_CATEGORY: '/admin/category/:id/delete',

     /**
     * 分类关联产品列表
     * @param(category_id)
     * category_id: 分类ID
     * 
     */
     GET_CATEGORY_ITEM: '/admin/app_category_item/list',

      /**
     * 删除关联产品
     * @param(id)
     * 
     */
      DELETE_CATEGORY_GOODS: '/admin/app_category_item/:id/delete',

      /**
     * 关联产品
     * @param(category_id, goods_ids)
     * category_id: 分类ID
     * goods_ids: 选中的商品id数组
     */
     SET_CATEGORY_ITEM: '/admin/app_category_item',
}


export const get_category_list = () => request(URL.GET_CATEGORY_LIST, 'GET')

export const add_category_api = ({name = ''} = { name: '' }) => request(URL.ADD_CATEGORY, 'POST', { name })

export const update_category_api = ({ id, name = '' }) => request(URL.UPDATE_CATEGORY.replace(':id', id), 'POST', { name })

export const update_category_status = ({ id, status = 1 }) => request(URL.UPDATE_CATEGORY_STATUS.replace(':id', id), 'POST', { status })

export const delete_category_api = ({ id }) => request(URL.DELETE_CATEGORY.replace(':id', id), 'POST')

export const get_category_goods = ({ category_id }) => request(URL.GET_CATEGORY_ITEM, 'GET', { category_id })

export const delete_category_goods = ({ id }) => request(URL.DELETE_CATEGORY_GOODS.replace(':id', id), 'POST')

export const set_category_goods = ( options ) => request(URL.SET_CATEGORY_ITEM, 'POST', options)




