// 分销接口

import request from "~/axios.js";

const URL = {

     /**
     * 分销数据统计
     * 
     */
    GET_STATISTICS: '/admin/agent/statistics',

    /**
     * 分销推广员列表
     * @param (page, keyword, type, starttime, endtime, level, user_id)
     * keyword: 手机号/邮箱/用户...
     * type: 时间段：all全部，today今天，yesterday昨天，last7days最近7天
     * starttime: 开始时间，yyyy-mm-dd
     * endtime: 结束时间，yyyy-mm-dd
     * level: 用户类型：0全部，1一级推广，2二级推广
     * user_id: 推广人ID
     * 
     */
    STATISTICS_LIST: '/admin/agent/:page?type=all',

    /**
     * 推广订单列表
     * @param (page, type, starttime, endtime)
     * 
     */
    USER_BILL_LIST: '/admin/user_bill/:page',

    /**
     * 修改分销配置
     * @param (distribution_open, store_first_rebate, store_second_rebate, spread_banners)
     * distribution_open: 分销启用:0禁用1启用
     * store_first_rebate: 一级返佣比例：0~100
     * store_second_rebate: 二级返佣比例：0~100
     * spread_banners: 分销海报图
     * is_self_brokerage: 自购返佣:0否1是
     * settlement_days: 结算时间（单位：天）
     * brokerage_method: 佣金到账方式:hand手动,wx微信
     */
    SET_DISTRIBUTION_SETTING: '/admin/distribution_setting/set',

    /**
     * 获取分销配置
     */
    GET_DISTRIBUTION_SETTING: '/admin/distribution_setting/get',

}

export const get_statistics = () => request(URL.GET_STATISTICS, 'GET')

export const statistics_list = ({page, ...options}) => request(URL.STATISTICS_LIST.replace(':page', page), 'GET', options)

export const user_bill_list = ({page, ...options}) => request(URL.USER_BILL_LIST.replace(':page', page), 'GET', options)

export const set_distribution_setting = (options) => request(URL.SET_DISTRIBUTION_SETTING, 'POST', options)

export const get_distribution_setting = () => request(URL.GET_DISTRIBUTION_SETTING, 'GET')

