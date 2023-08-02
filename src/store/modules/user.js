import Manager_api from '~/api/manager.js';
import { setToken } from '~/composables/auth.js'
export default {
    state: () => ({ 
        user: {},
        num: 2
    }),
    getters: { 
        user: state => state.user,
        num: state => state.num
    },
    mutations: { 
        // 记录用户信息
        SET_USERINFO(state, user) {
            state.user = user
        }
    },
    actions: { 
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
        }
    },
}