import axios from "axios";
import { toast } from '~/composables/util.js'
import { getToken } from '~/composables/auth.js'
import store from '~/store'

const baseURL = process.env.NODE_ENV === 'development' ? '/api' : 'http://ceshi13.dishait.cn';
const instance = axios.create({
    baseURL,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么

    const token = getToken()
    if (token) {
        config.headers['token'] = token
    }

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data.data;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么

    const msg = error?.response.data.msg || '请求失败'
    
    if (msg == "非法token，请先登录！") {
        store.commit('CLEAR_DATA')
        location.reload()
    }
    
    toast(msg, 'error')

    return Promise.reject(error);
  });

function request(url, type = 'GET', data = {}, options = {}) {
    return new Promise((resolve, reject) => {
        options = {
            url,
            method: type,
            ...options
        }
        if (type.toLowerCase() === 'get') {
            options.params = data
        } else {
            options.data = data
        }

        instance(options).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}


export default request;