// 公告接口

import request from "~/axios.js";

const URL = {

     /**
     * 公告列表
     * @param (page)
     * 
     */
    NOTICE_LIST: '/admin/notice/:page',

    /**
     * 增加公告
     * @param (title, content)
     * 
     */
    ADD_NOTICE: '/admin/notice',

    /**
     * 修改公告
     * @param (id, title, content)
     * 
     */
    UPDATE_NOTICE: '/admin/notice/:id',

    /**
     * 删除公告
     * @param (id)
     * 
     */
    DELETE_NOTICE: '/admin/notice/:id/delete'

}

export const get_noticeList_api = ({ page = 1 } = { page: 1 }) => request(URL.NOTICE_LIST.replace(':page', page), 'GET')

export const add_notice_api = ({ title = '', content = '' } = { title: '', content: '' }) => request(URL.ADD_NOTICE, 'POST', { title, content })

export const update_notice_api = ({id, title = '', content = ''}) => request(URL.UPDATE_NOTICE.replace(':id', id), 'POST', { ntitle, contentame })

export const delete_notice_api = ({ id }) => request(URL.DELETE_NOTICE.replace(':id', id), 'POST')

