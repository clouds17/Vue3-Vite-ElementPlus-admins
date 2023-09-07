// 优惠券接口

import request from "~/axios.js";

const URL = {

     /**
     * 优惠券列表
     * @param (page)
     * 
     */
    COUPON_LIST: '/admin/coupon/:page',

    /**
     * 增加优惠券
     * @param (name, type, value, total, min_price, start_time, end_time, order, desc)
     * name: 优惠券名称
     * type: 类型：0满减,1折扣
     * value: 面值
     * total: 发行量
     * min_price: 最低使用价格
     * start_time: 开始时间
     * end_time: 结束时间
     * order: 排序
     * desc: 描述
     * 
     */
    ADD_COUPON: '/admin/coupon',

    /**
     * 修改优惠券
     * @param (id, name, type, value, total, min_price, start_time, end_time, order, desc)
     * name: 优惠券名称
     * type: 类型：0满减,1折扣
     * value: 面值
     * total: 发行量
     * min_price: 最低使用价格
     * start_time: 开始时间
     * end_time: 结束时间
     * order: 排序
     * desc: 描述
     * 
     */
    UPDATE_COUPON: '/admin/coupon/:id',

    /**
     * 删除公告
     * @param (id)
     * 
     */
    DELETE_COUPON: '/admin/coupon/:id/delete',

    /**
     * 失效优惠券
     * @param (id, status)
     * status: 状态：0失效
     */
    UPDATE_COUPON_STATUS: '/admin/coupon/:id/update_status'

}

export const get_couponList_api = ({ page = 1 } = { page: 1 }) => {
    return new Promise((resolve, reject) => {
        request(URL.COUPON_LIST.replace(':page', page), 'GET')
            .then(res => {
                res.list.map(item => {
                    let start_time = new Date(item.start_time),
                            cur_time = Date.now(),
                            end_time = new Date(item.end_time)

                    if (cur_time < start_time) {
                        item.statusText = '未开始'
                    } else if (cur_time > end_time) {
                        item.statusText = '已结束'
                    } else if (item.status == 0) {
                        item.statusText = '已失效'
                    } else {
                        item.statusText = '领取中'
                    }
                    return item
                })

                resolve(res)

            }).catch(err => reject(err))
    })
}

export const add_coupon_api = ({ 
    name = '优惠券1', 
    type = 0,
    value = 20,
    total = 100,
    min_price = 100,
    start_time = 1654949675,
    end_time = 1664949675,
    order = 50,
    desc = ''
}) => request(URL.ADD_COUPON, 'POST', { name, type, value, total, min_price, start_time, end_time, order, desc })

export const update_coupon_api = ({
    id,
    name = '优惠券1', 
    type = 0,
    value = 20,
    total = 100,
    min_price = 100,
    start_time = 1654949675,
    end_time = 1664949675,
    order = 50,
    desc = ''
}) => request(URL.UPDATE_COUPON.replace(':id', id), 'POST', { name, type, value, total, min_price, start_time, end_time, order, desc })

export const delete_coupon_api = ({ id }) => request(URL.DELETE_COUPON.replace(':id', id), 'POST')

export const update_coupon_status = ({ id, status = 0 } = { id: 0, status: 0 }) => request(URL.UPDATE_COUPON_STATUS.replace(':id', id), 'POST', { status })

