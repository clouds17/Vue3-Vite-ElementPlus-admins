import store from "../store"

function hasPermission(value, el = false) {
    if (!Array.isArray(value)) {
        throw new Error(`需要配置权限，例如 v-permission="['getStatistics1,GET']"`)
    }

    const hasAuth = value.some(v => store.getters.ruleNames.includes(v))
    if (el && !hasAuth) {
        el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
}

export default {
    install(app) {
        // 指令权限控制
        app.directive('permission', {
            mounted(el, binding) {
                hasPermission(binding.value, el)
            }
        })
    }
}