// 管理员及登录退出接口

import request from "~/axios.js";

const URL = {
    // 登录
    LOGIN: '/admin/login',
    // 获取用户信息
    GETINFO: '/admin/getinfo',
    // 退出登录
    LOGOUT: '/admin/logout',
    // 修改密码
    UPDATE_PASSWORD: '/admin/updatepassword',
    /**
     * 获取管理员列表
     * @param(limit, keyword)
     * limit: 每页条数
     * keyword: 管理员账户
     * 
     */
    GET_MANAGER_LIST: '/admin/manager/:page',
     /**
     * 增加管理员
     * @param(username, password, role_id, status, avatar)
     * username: 用户名
     * password: 密码
     * role_id: 角色ID
     * status: 是否启用：0禁用1启用
     * avatar: 头像
     * 
     */
     ADD_MANAGER: '/admin/manager',

    /**
     * 修改管理员
     * @param(id, username, password, role_id, status, avatar)
     * id: 管理员id
     * username: 用户名
     * password: 密码
     * role_id: 角色ID
     * status: 是否启用：0禁用1启用
     * avatar: 头像
     * 
     */
    UPDATE_MANAGER: '/admin/manager/:id',

    /**
     * 删除管理员
     */
    DELETE_MANAGER: '/admin/manager/:id/delete',

    /**
     * 修改管理员状态
     * @param(status)
     * status: 是否启用：0禁用1启用
     * 
     */
    UPDATE_MANAGER_STATUS: '/admin/manager/:id/update_status'

}


export const login_api = ({username, password}) => request(URL.LOGIN, 'POST', {username, password})

export const logout_api = () => request(URL.LOGOUT, 'POST')

export const getInfo = () => request(URL.GETINFO, 'POST')

export const update_password = ({oldpassword, password, repassword}) => request(URL.UPDATE_PASSWORD, 'POST', {oldpassword, password, repassword}) 

export const get_manager_list = ({ page = 1, limit = 10, keyword = '' } = { page: 1, limit: 10, keyword: '' }) => {
    return new Promise((resolve, reject) => {
        request(URL.GET_MANAGER_LIST.replace(':page', page), 'GET', { limit, keyword })
            .then(res => {
                res.list.map(item => {
                    item.isLoading = false
                    return item
                })
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}


export const add_manager_api = 
    ({ username = '', password = '',  role_id = 0, status = 0, avatar = ''} 
    = { username: '', password: '',  role_id: 0, status: 0, avatar: ''}) => 
        request(URL.ADD_MANAGER, 'POST', { username, password, role_id, status, avatar })

export const update_manager_api = 
    ({ id = 0, username = '', password = '',  role_id = 0, status = 0, avatar = ''} 
    = { id: 0, username: '', password: '',  role_id: 0, status: 0, avatar: ''}) => 
        request(URL.UPDATE_MANAGER.replace(':id', id), 'POST', { username, password, role_id, status, avatar })


export const delete_manager_api = ({ id = 0 } = { id: 0 }) => request(URL.DELETE_MANAGER.replace(':id', id), 'POST')

export const update_manager_status = ({ id = 0, status = 0 } = { id: 0, status: 0 }) => 
    request(URL.UPDATE_MANAGER_STATUS.replace(':id', id), 'POST', { status })

