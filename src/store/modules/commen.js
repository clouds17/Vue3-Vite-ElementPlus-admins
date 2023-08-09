export default {
    state: () => {
        return {
            // 侧边栏是否折叠
            isCollapse: null,
            // 当前菜单路由
            defaultMenuActive: null
        }
    },
    getters: {
        isCollapse: state => state.isCollapse || false,
        defaultMenuActive: state => state.defaultMenuActive || '/'
    },
    mutations: {
        SET_ISCOLLAPSE(state) {
            state.isCollapse = state.isCollapse ? false : true
        },
        SET_MENUACTIVE(state, path) {
            state.defaultMenuActive = path
        }
    },
    actions: {

    }
}