// 用户接口

import request from "~/axios.js";

const URL = {

     /**
     * 用户列表
     * @param (page)
     * 
     */
    USER_LIST: '/admin/user/:page',

    /**
     * 增加用户
     * @param (username, password, status, nickname, phone, email, avatar, user_level_id)
     * username: 用户名
     * password: 密码
     * status: 状态：0禁用1启用
     * nickname: 用户名
     * phone: 手机
     * email: 邮箱
     * avatar: 头像
     * user_level_id: 会员等级
     * 
     */
    ADD_USER: '/admin/user',

    /**
     * 修改用户
    * @param (id, username, password, status, nickname, phone, email, avatar, user_level_id)
     * username: 用户名
     * password: 密码
     * status: 状态：0禁用1启用
     * nickname: 昵称
     * phone: 手机
     * email: 邮箱
     * avatar: 头像
     * user_level_id: 会员等级
     */
    UPDATE_USER: '/admin/user/:id',

    /**
     * 修改用户状态
     * @param (id, status)
     * status: 状态：0禁用1启用
     */
    UPDATE_USER_STATUS: '/admin/user/:id/update_status',

    /**
     * 删除用户
     * @param (id)
     * 
     */
    DELETE_USER: '/admin/user/:id/delete'

}

export const get_userList_api = ({ page = 1, limit = 10, ...options }) => request(URL.USER_LIST.replace(':page', page), 'GET', { limit, ...options })

export const add_user_api = (options) => request(URL.ADD_USER, 'POST', options)

export const update_user_api = ({id, ...options}) => request(URL.UPDATE_USER.replace(':id', id), 'POST', options)

export const update_user_status = ({id, status = 1}) => request(URL.UPDATE_USER_STATUS.replace(':id', id), 'POST', {status})

export const delete_user_api = ({ id }) => request(URL.DELETE_USER.replace(':id', id), 'POST')

