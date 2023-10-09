// 订单列表

import request from "~/axios.js";

const URL = {
    /**
     * 获取商品列表
     * @param(page, tab, no, starttime, endtime, name, phone)
     * tab: 订单类型：all全部，nopay待支付，noship待发货，shiped待收货，received已收货，finish已完成，closed已关闭，refunding退款中
     * no: 订单号
     * starttime: 开始时间，yyyy-mm-dd
     * endtime: 结束时间，yyyy-mm-dd
     * name： 收货人
     * phone： 收货人手机号
     */
    GET_ORDER_LIST: '/admin/order/:page',
    

    /**
     * 批量删除商品
     * @param (ids)
     * ids: 要删除的id数组
     */
    DELETE_ORDER: '/admin/order/delete_all',

    /**
     * 订单发货
     * @param (id, express_company, express_no)
     * id: 订单id,
     * express_company: 快递公司,
     * express_no: 快递单号
     */
    SHIP_ORDER: '/admin/order/:id/ship',

    /**
     * 拒绝or同意退款
     * @param (id, agree, disagree_reason)
     * id: 订单id,
     * agree: 是否同意，0拒绝，1同意,
     * disagree_reason: 拒绝理由
     */
    REFUND_ORDER: '/admin/order/:id/handle_refund',

    /**
     * 导出订单
     * @param(tab, starttime, endtime)
     * tab: 订单类型：all全部，nopay待支付，noship待发货，shiped待收货，received已收货，finish已完成，closed已关闭，refunding退款中
     * starttime: 开始时间，yyyy-mm-dd
     * endtime: 结束时间，yyyy-mm-dd
     */
    EXCELEXPORT_ORDER_LIST: '/admin/order/excelexport',

    /**
     * 快递公司列表
     * GET
     */
    EXPRESS_COMPANY: '/admin/express_company/1',

    
    /**
     * 查看订单物流信息
     * GET
     * @param(id)
     */
    GET_SHIP_INFO: '/admin/order/:id/get_ship_info',

}


export const get_order_list = ({ page = 1, ...options }) => request(URL.GET_ORDER_LIST.replace(':page', page), 'GET', { ...options })

export const delete_order_api = ({ ids = [] } = { ids: [] }) => request(URL.DELETE_ORDER, 'POST', { ids })

export const ship_order_api = ({ id, express_company, express_no }) => request(URL.SHIP_ORDER.replace(':id', id), 'POST', { express_company, express_no })

export const refund_order_api = ({ id, agree = 0, disagree_reason = '' }) => request(URL.REFUND_ORDER.replace(':id', id), 'POST', { agree, disagree_reason })

export const excelexport_order_list = ({ tab = '', starttime = '', endtime = '' }) => request(URL.EXCELEXPORT_ORDER_LIST, 'POST', { tab, starttime, endtime }, {
    responseType: 'blob'
})

export const express_company = () => request(URL.EXPRESS_COMPANY, 'GET')

export const get_ship_info = ({ id }) => request(URL.GET_SHIP_INFO.replace(':id', id), 'GET')



