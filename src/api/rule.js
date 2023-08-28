// 菜单权限接口


import request from "~/axios.js";

const URL = {

     /**
     * 菜单权限列表

     */
    GET_RULE_LIST: '/admin/rule/1',

    /**
     * 增加菜单权限
     * @param (rule_id, menu, name, condition, method, status, order, icon, frontpath)
     * 
     * rule_id: 上级菜单ID
     * menu: 是否是菜单，0否1是
     * name: 菜单/权限名称
     * condition: 后端规则，由后端提供的接口别名（menu为0时必填）
     * method: 请求方式：GET/POST/PUT/DELETE（menu为0时必填）
     * status: 是否启用
     * order: 排序
     * icon: element-plus图标（menu为1必填）
     * frontpath: 对应前端路由路径（menu为1且rule_id>0时必填）
     * 
     */
    ADD_RULE: '/admin/rule',

    /**
     * 修改菜单权限
     * @param (id, rule_id, menu, name, condition, method, status, order, icon, frontpath)
     * 
     * rule_id: 上级菜单
     * menu: 是否是菜单，0否1是
     * name: 菜单/权限名称
     * condition: 后端规则，由后端提供的接口别名（menu为0时必填）
     * method: 请求方式：GET/POST/PUT/DELETE（menu为0时必填）
     * status: 是否启用
     * order: 排序
     * icon: element-plus图标（menu为1必填）
     * frontpath: 对应前端路由路径（menu为1且rule_id>0时必填）
     * 
     */
    UPDATE_RULE: '/admin/rule/:id',

    /**
     * 删除菜单权限
     * @param (id)
     * 
     */
    DELETE_RULE: '/admin/rule/:id/delete',
     /**
     * 修改菜单权限状态
     * @param(status)
     * status: 是否启用：0禁用1启用
     * 
     */
    UPDATE_RULE_STATUS: '/admin/rule/:id/update_status'

}

export const get_ruleList_api = () => {
    return new Promise((resolve, reject) => {
        request(URL.GET_RULE_LIST, 'GET')
            .then(res => {
                res.list.map(item => {
                    item.isLoading = false
                    return item
                })
                resolve(res)
            })
            .catch(err => reject(err))
    })
}

export const add_rule_api = ({ 
    rule_id = 0,
    menu = 1,
    name = '商品列表分页',
    condition = 'getGoodsList', 
    method = 'GET', 
    status = 1, 
    order = 0, 
    icon = 'shopping-cart-full', 
    frontpath = '/goods/list'
 }) => request(URL.ADD_RULE, 'POST', { rule_id, menu, name, condition, method, status, order, icon, frontpath })

export const update_rule_api = ({
    id,
    rule_id = 0,
    menu = 1,
    name = '商品列表分页',
    condition = 'getGoodsList', 
    method = 'GET', 
    status = 1, 
    order = 0, 
    icon = 'shopping-cart-full', 
    frontpath = '/goods/list'
}) => request(URL.UPDATE_RULE.replace(':id', id), 'POST', { rule_id, menu, name, condition, method, status, order, icon, frontpath })

export const delete_rule_api = ({ id }) => request(URL.DELETE_RULE.replace(':id', id), 'POST')

export const update_rule_status = ({ id = 0, status = 0 } = { id: 0, status: 0 }) => 
    request(URL.UPDATE_RULE_STATUS.replace(':id', id), 'POST', { status })

