// 会员等级接口

import request from "~/axios.js";

const URL = {

     /**
     * 会员等级列表
     * @param (page)
     * 
     */
    LEVEL_LIST: '/admin/user_level/:page',

    /**
     * 增加会员等级
     * @param (name, level, status, discount, max_price, max_times)
     * name: 等级名称
     * level: 等级权重
     * status: 状态：0禁用1启用
     * discount: 折扣率(%)
     * max_price: 累计消费金额
     * max_times: 累计消费次数
     * 
     */
    ADD_LEVEL: '/admin/user_level',

    /**
     * 修改会员等级
     * @param (id, name, level, status, discount, max_price, max_times)
     * name: 等级名称
     * level: 等级权重
     * status: 状态：0禁用1启用
     * discount: 折扣率(%)
     * max_price: 累计消费金额
     * max_times: 累计消费次数
     */
    UPDATE_LEVEL: '/admin/user_level/:id',

    /**
     * 修改会员等级状态
     * @param (id, status)
     * status: 状态：0禁用1启用
     */
    UPDATE_LEVEL_STATUS: '/admin/user_level/:id/update_status',

    /**
     * 删除会员等级
     * @param (id)
     * 
     */
    DELETE_LEVEL: '/admin/user_level/:id/delete'

}

export const get_levelList_api = ({ page = 1 } = { page: 1 }) => request(URL.LEVEL_LIST.replace(':page', page), 'GET')

export const add_level_api = (options) => request(URL.ADD_LEVEL, 'POST', options)

export const update_level_api = ({id, ...options}) => request(URL.UPDATE_LEVEL.replace(':id', id), 'POST', options)

export const update_level_status = ({id, status = 1}) => request(URL.UPDATE_LEVEL_STATUS.replace(':id', id), 'POST', {status})

export const delete_level_api = ({ id }) => request(URL.DELETE_LEVEL.replace(':id', id), 'POST')

