// 系统配置接口

import request from "~/axios.js";

const URL = {

     /**
     * 获取原有系统设置
     * 
     */
    GET_SYSCONFIG: '/admin/sysconfig',

    /**
     * 修改系统设置
     * @param ()
     * 
     */
    SET_SYSCONFIG: '/admin/sysconfig',

    /**
     * 上传文件
     * @param ()
     * 
     */
    UPLOAD_SYSCONFIG_FILE: '/admin/sysconfig/upload'

}

const baseURL = import.meta.env.VITE_APP_BASE_API;

export const get_sysconfig_api = () => request(URL.GET_SYSCONFIG, 'GET')

export const set_sysconfig_api = (options) => request(URL.SET_SYSCONFIG, 'POST', options)

// export const upload_sysconfig_file = (options) => request(URL.UPLOAD_SYSCONFIG_FILE, 'POST', options)

export const upload_sysconfig_file = baseURL + URL.UPLOAD_SYSCONFIG_FILE

