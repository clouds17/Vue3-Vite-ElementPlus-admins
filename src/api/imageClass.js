// 图库分类接口

import request from "~/axios.js";

const URL = {
    /**
     * 分类列表
     * @param (page, limit)
     * 
     */
    IMAGECLASS: '/admin/image_class/:page',

     /**
     * 指定分类下的图片列表
     * @param (id, page, limit)
     * id: 图库ID
     * 
     */
    IMAGECLASS_ID: '/admin/image_class/:id/image/:page',

    /**
     * 增加图库分类
     * @param (name, order)
     * name: 图库分类名称
     * order: 排序
     */
    ADD_IMAGECLASS: '/admin/image_class',

    /**
     * 修改图库分类
     * @param (id, name, order)
     * id: 图库ID
     * name: 图库分类名称
     * order: 排序
     */
     UPDATE_IMAGECLASS: '/admin/image_class/:id',

    /**
     * 删除图库分类
     * @param (id)
     * id: 图库ID
     * 
     */
    DELETE_IMAGECLASS: '/admin/image_class/:id/delete',
    
}


export const get_imageClass = ({page = 1, limit = 10} = { page: 1, limit: 10 }) => request(URL.IMAGECLASS.replace(':page', page), 'GET', { limit })

export const get_curImageList = ({id, page = 1, limit = 10}) => request(URL.IMAGECLASS_ID.replace(':id', id).replace(':page', page), 'GET', { limit })

export const add_imageClass = ({ name, order }) => request(URL.ADD_IMAGECLASS, 'POST', { name, order })

export const update_imageClass = ({ id, name, order }) => request(URL.UPDATE_IMAGECLASS.replace(':id', id), 'POST', { name, order })

export const delete_imageClass = ({ id }) => request(URL.DELETE_IMAGECLASS.replace(':id', id), 'POST')

