// 商品评价接口

import request from "~/axios.js";

const URL = {

     /**
     * 商品评价列表
     * @param (page, title)
     * title: 商品标题
     */
    GOODS_COMMENT_LIST: '/admin/goods_comment/:page',

    /**
     * 修改商品评价状态
     * @param (id, status)
     * status: 状态：0禁用1启用
     */
    UPDATE_GOODS_COMMENT_STATUS: '/admin/goods_comment/:id/update_status',

    /**
     * 回复商品评价
     * @param (id, data)
     * data: 评价内容
     */
    REVIEW_GOODS_COMMENT: '/admin/goods_comment/review/:id'

}

export const get_goods_comment_list = ({ page = 1, title = '' } = { page: 1, title: '' }) => {
    return new Promise((resolve, reject) => {
        request(URL.GOODS_COMMENT_LIST.replace(':page', page), 'GET', { title })
        .then(res => {
            let arr = []
            res.list.forEach(o => {
                arr.push({
                    textareaEdit: false
                })
            })
            res.textareaObj = arr
            resolve(res)
        })
        .catch(err => reject(err))
    })
}

export const update_goods_comment_status = ({id, status = 1}) => request(URL.UPDATE_GOODS_COMMENT_STATUS.replace(':id', id), 'POST', {status})

export const review_goods_comment = ({ id, data = '' }) => request(URL.REVIEW_GOODS_COMMENT.replace(':id', id), 'POST', { data })

