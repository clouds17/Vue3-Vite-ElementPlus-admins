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
    login: ({username, password}) => request(URL.LOGIN, 'POST', {username, password}),

    getInfo: () => request(URL.GETINFO, 'POST'),
    
    logout: () => request(URL.LOGOUT, 'POST'),

    updatePassword: ({oldpassword, password, repassword}) => request(URL.UPDATE_PASSWORD, 'POST', {oldpassword, password, repassword}) 
}
