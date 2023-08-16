// 图库分类接口

import request from "~/axios.js";

const URL = {

     /**
     * 指定分类下的图片列表
     * @param (id, page, limit)
     * id: 图库ID
     * 
     */
    IMAGECLASS_ID: '/admin/image_class/:id/image/:page',
}


export const get_curImageList = ({id, page = 1, limit = 10}) => request(URL.IMAGECLASS_ID.replace(':id', id).replace(':page', page), 'GET', { limit })

