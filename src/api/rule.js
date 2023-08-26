// 权限管理接口

import request from "~/axios.js";

const URL = {

     /**
     * 公告列表
     * @param (page)
     * 
     */
    GET_RULE_LIST: '/admin/rule/1',

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

export const get_ruleList_api = () => request(URL.GET_RULE_LIST, 'GET')

export const add_notice_api = ({ title = '', content = '' } = { title: '', content: '' }) => request(URL.ADD_NOTICE, 'POST', { title, content })

export const update_notice_api = ({id, title = '', content = ''}) => request(URL.UPDATE_NOTICE.replace(':id', id), 'POST', { title, content })

export const delete_notice_api = ({ id }) => request(URL.DELETE_NOTICE.replace(':id', id), 'POST')

