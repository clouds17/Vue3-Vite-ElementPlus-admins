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
    UPDATE_PASSWORD: '/admin/updatepassword'
}


export const login_api = ({username, password}) => request(URL.LOGIN, 'POST', {username, password})

export const logout_api = () => request(URL.LOGOUT, 'POST')

export const getInfo = () => request(URL.GETINFO, 'POST')

export const update_password = ({oldpassword, password, repassword}) => request(URL.UPDATE_PASSWORD, 'POST', {oldpassword, password, repassword}) 

