import { login_api, logout_api, getInfo, update_password } from '~/api/manager.js';

import { setToken, removeToken } from '~/composables/auth.js'


export default {
    state: () => ({ 
        // 用户数据
        user: null,
        // 菜单数据
        menus: null,
        ruleNames: null
    }),
    getters: { 
        user: state => state.user || {},
        menus: state => state.menus || [],
        ruleNames: state => state.ruleNames || []
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
            state.menus = []
            state.ruleNames = []
        },
        // 设置菜单数据
        SET_MENUS(state, menus) {
            state.menus = menus
        },
        SET_RULENAMES(state, ruleNames) {
            state.ruleNames = ruleNames
        }
    },
    actions: { 
        // 登录
        Login({commit}, { username, password }) {
            return new Promise((resolve, reject) => {
                login_api({
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
                logout_api()
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
                getInfo()
                    .then(res => {
                        commit('SET_USERINFO', res)
                        commit('SET_MENUS', res.menus)
                        commit('SET_RULENAMES', res.ruleNames)
                        resolve(res)
                    })
                    .catch(err => reject(err))
            })
        },
        // 修改密码
        UpdatePassword({ commit }, {oldpassword, password, repassword}) {
            return new Promise((resolve, reject) => {
                update_password({
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