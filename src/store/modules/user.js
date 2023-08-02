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
    actions: {  },
}