// 首页统计接口

import request from "~/axios.js";

const URL = {
    // 后台首页统计1
    STATISTICS1: '/admin/statistics1',
    // 后台首页统计2
    STATISTICS2: '/admin/statistics2',
    // 后台首页统计3
    /**
     * @param type
     * 统计类型：month近1个月、week近1周、hour近24小时
     */
    STATISTICS3: '/admin/statistics3',
    
}



export default {
    statistics1: () => request(URL.STATISTICS1, 'GET'),

    statistics2: () => request(URL.STATISTICS2, 'GET'),

    statistics3: ({ type }) => request(URL.STATISTICS3, 'GET', { type }),

}
