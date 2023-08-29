// 商品规格接口

import request from "~/axios.js";

const URL = {

     /**
     * 商品规格列表
     * @param (page)
     * 
     */
    SKUS_LIST: '/admin/skus/:page',

    /**
     * 增加商品规格
     * @param (status, name, order, default)
     * status: 状态 1开启0关闭
     * name: 规格名称
     * order: 排序
     * default: 规格值，以逗号分割开
     * 
     */
    ADD_SKUS: '/admin/skus',

    /**
     * 修改商品规格
     * @param (id, status, name, order, default)
     * status: 状态 1开启0关闭
     * name: 规格名称
     * order: 排序
     * default: 规格值，以逗号分割开
     */
    UPDATE_SKUS: '/admin/skus/:id',

    /**
     * 批量删除商品规格
     * @param (ids)
     * ids: 要删除的id数组
     * 
     */
    DELETE_SKUS: '/admin/skus/delete_all',

    /**
     * 修改商品规格状态
     * @param (id, status)
     * 
     */
    UPDATE_SKUS_STATUS: '/admin/skus/:id/update_status'

}

export const get_skusList_api = ({ page = 1 } = { page: 1 }) => {
    return new Promise((resolve, reject) => {
        request(URL.SKUS_LIST.replace(':page', page), 'GET')
        .then(res => {
            res.list.map(item => {
                item.isLoading = false
                return item
            })
            resolve(res)
        }).catch(err => reject(err))
    })
}

export const add_skus_api = ({ status = 1, name = '', order = 1000, default: defaultId = '' }) => {
    return request(URL.ADD_SKUS, 'POST', { status, name, order, 'default': defaultId })
}

export const update_skus_api = ({id,  status = 1, name = '', order = 1000, default: defaultId = '' }) => {
    return request(URL.UPDATE_SKUS.replace(':id', id), 'POST', { status, name, order, 'default': defaultId })
}
        

export const delete_skus_api = ({ ids }) => request(URL.DELETE_SKUS, 'POST', { ids })

export const update_skus_status = ({ id, status }) => request(URL.UPDATE_SKUS_STATUS.replace(':id', id), 'POST', { status })

