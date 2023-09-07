// 商品分类接口

import request from "~/axios.js";

const URL = {
    /**
     * 获取商品分类列表
     * 
     */
    GET_CATEGORY_LIST: '/admin/category',
     
}


export const get_category_list = () => request(URL.GET_CATEGORY_LIST, 'GET')


