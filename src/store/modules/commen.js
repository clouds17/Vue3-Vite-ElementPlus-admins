export default {
    state: () => {
        return {
            // 侧边栏是否折叠
            isCollapse: null
        }
    },
    getters: {
        isCollapse: state => state.isCollapse || false
    },
    mutations: {
        SET_ISCOLLAPSE(state) {
            state.isCollapse = state.isCollapse ? false : true
        }
    },
    actions: {

    }
}