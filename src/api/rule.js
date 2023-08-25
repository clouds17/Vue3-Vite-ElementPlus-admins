// 菜单权限接口

import request from "~/axios.js";

const URL = {

     /**
     * 菜单权限列表
     * 
     */
    RULE_LIST: '/admin/rule/1',

    /**
     * 增加菜单权限
     * @param (rule_id, menu, name, condition, method, status, order, icon, frontpath)
     * 
     * rule_id: 上级菜单ID
     * menu: 是否是菜单，0否1是
     * name: 菜单/权限名称
     * condition: 后端规则，由后端提供的接口别名（menu为0时必填）
     * method: 请求方式：GET/POST/PUT/DELETE（menu为0时必填）
     * status: 是否启用
     * order: 排序
     * icon: element-plus图标（menu为1必填）
     * frontpath: 对应前端路由路径（menu为1且rule_id>0时必填）
     * 
     */
    ADD_RULE: '/admin/rule',

    /**
     * 修改菜单权限
     * @param (id, title, content)
     * 
     */
    UPDATE_RULE: '/admin/rule/193',

    

}

export const get_rule_api = () => request(URL.RULE_LIST, 'GET')

export const add_notice_api = ({ title = '', content = '' } = { title: '', content: '' }) => request(URL.ADD_NOTICE, 'POST', { title, content })

export const update_notice_api = ({id, title = '', content = ''}) => request(URL.UPDATE_NOTICE.replace(':id', id), 'POST', { title, content })

export const delete_notice_api = ({ id }) => request(URL.DELETE_NOTICE.replace(':id', id), 'POST')

