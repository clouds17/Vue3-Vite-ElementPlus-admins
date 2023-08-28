// 角色接口

import request from "~/axios.js";

const URL = {

     /**
     * 角色列表
     * @param (page)
     * 
     */
    ROLE_LIST: '/admin/role/:page',

    /**
     * 增加角色
     * @param (name, status, desc)
     * 
     * name: 角色名称
     * status: 角色状态：0禁用 1启动
     * desc: 角色描述
     * 
     */
    ADD_ROLE: '/admin/role',

    /**
     * 修改角色
     * @param (id, name, status, desc)
     * 
     * name: 角色名称
     * status: 角色状态：0禁用 1启动
     * desc: 角色描述
     * 
     */
    UPDATE_ROLE: '/admin/role/:id',

    /**
     * 删除角色
     * @param (id)
     * 
     */
    DELETE_ROLE: '/admin/role/:id/delete',

    /**
     * 修改角色权限
     * @param (id, status)
     * 
     * status: 角色状态：0禁用 1启动
     * 
     */
     UPDATE_ROLE_STATUS: '/admin/role/:id/update_status',

     /**
     * 配置角色权限
     * @param (id, rule_ids)
     * 
     * {
            "id": 42,
            "rule_ids": [ 5, 10, 174, 175, 176 ]
        }
     */
     SET_RULES: '/admin/role/set_rules',

}

export const get_roleList_api = ({ page = 1 } = { page: 1 }) => request(URL.ROLE_LIST.replace(':page', page), 'GET')

export const add_role_api = ({ name = '', status = 1, desc = '' } = { name: '', status: 1, desc: '' }) => request(URL.ADD_ROLE, 'POST', { name, status, desc })

export const update_role_api = ({id, name = '', status = 1, desc = ''}) => request(URL.UPDATE_ROLE.replace(':id', id), 'POST', { name, status, desc })

export const delete_role_api = ({ id }) => request(URL.DELETE_ROLE.replace(':id', id), 'POST')

export const update_role_status = ({ id, status = 1 }) => request(URL.UPDATE_ROLE_STATUS.replace(':id', id), 'POST', { status })

