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



export default {
    login: (options = {}) => request(URL.LOGIN, 'POST', {username, password}),

    getInfo: (options = {}) => request(URL.GETINFO, 'POST'),
    
    logout: (options = {}) => request(URL.LOGOUT, 'POST'),

    updatePassword: (options = {}) => request(URL.UPDATE_PASSWORD, 'POST', {oldpassword, password, repassword}) 
}
