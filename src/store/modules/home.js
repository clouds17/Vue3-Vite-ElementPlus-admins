import Home_api from '~/api/home.js'

export default {
    state: () => {
        return {}
    },
    getters: {},
    mutations: {},
    actions: {
        // 后台首页统计1
        Statistics1({commit}) {
            return new Promise((resolve, reject) => {
                Home_api.statistics1()
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
            })
        },
        // 后台首页统计2
        Statistics2({commit}) {
            return new Promise((resolve, reject) => {
                Home_api.statistics2()
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
            })
        },
        // 后台首页统计3
        Statistics3({commit}, { type = 'hour' } = { type: 'hour' }) {
            return new Promise((resolve, reject) => {
                Home_api.statistics3({
                    type
                })
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
            })
        }
    }
}