import Manager_api from '~/api/manager.js';
import { setToken, removeToken } from '~/composables/auth.js'


export default {
    state: () => ({ 
        user: {},
    }),
    getters: { 
        user: state => state.user,
    },
    mutations: { 
        // 记录用户信息
        SET_USERINFO(state, user) {
            state.user = user
        },
        // 退出时清除信息
        CLEAR_DATA(state) {
            // 清除token
            removeToken()
            // 清除用户信息
            state.user = {}
        }
    },
    actions: { 
        // 登录
        Login({commit}, { username, password }) {
            return new Promise((resolve, reject) => {
                Manager_api.login({
                    username, 
                    password
                })
                    .then(res => {
                        // 存储token
                        setToken(res.token)
                        resolve(res)
                    })
                    .catch(err => reject(err))
            })
        },
        // 退出登录
        Logout({ commit }) {
            return new Promise((resolve, reject) => {
                Manager_api.logout()
                    .then(res => {
                        // 用它是因为怕token过期，还得请求一遍退出登录
                        commit('CLEAR_DATA')
                        resolve(res)
                    })
                    .catch(err => reject(err))
            })
        },
        // 获取用户信息
        GetInfo({commit}) {
            return new Promise((resolve, reject) => {
                // 获取用户信息
                Manager_api.getInfo()
                    .then(res => {
                        commit('SET_USERINFO', res)
                        resolve(res)
                    })
                    .catch(err => reject(err))
            })
        },
        // 修改密码
        UpdatePassword({ commit }, {oldpassword, password, repassword}) {
            return new Promise((resolve, reject) => {
                Manager_api.updatePassword({
                    oldpassword, 
                    password, 
                    repassword
                })
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
            })
        }
    },
}