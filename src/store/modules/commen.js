export default {
    state: () => {
        return {
            // 侧边栏是否折叠
            isCollapse: null,
            // 侧边栏宽度
            asideWidth: null,
            // 当前菜单路由
            defaultMenuActive: null
        }
    },
    getters: {
        asideWidth: state => state.asideWidth || '250px',
        defaultMenuActive: state => state.defaultMenuActive || '/'
    },
    mutations: {
        SET_ISCOLLAPSE(state) {
            state.asideWidth = state.asideWidth == '250px' || !state.asideWidth ? '64px' : '250px'
        },
        SET_MENUACTIVE(state, path) {
            state.defaultMenuActive = path
        }
    },
    actions: {

    }
}