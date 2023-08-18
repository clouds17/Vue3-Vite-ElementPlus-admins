// 图库接口

import request from "~/axios.js";

const URL = {

     /**
     * 指定分类下的图片列表
     * @param (id, page, limit)
     * id: 图库ID
     * 
     */
    IMAGECLASS_ID: '/admin/image_class/:id/image/:page',

    /**
     * 删除图片
     * @param (ids)
     * ids: [483]  数组
     * 
     */
    DELETEIMAGE: '/admin/image/delete_all',

    /**
     * 修改图片名称
     * @param (id, name)
     * 
     */
    UPDATE_IMAGE_NAME: '/admin/image/:id',

    /**
     * 图片上传
     * @param (image_class_id, img[])
     * image_class_id: 图库分类ID
     * img: [图片文件] 数组
     * 
     */
    UPLOAD_IMAGE: '/admin/image/upload'

}
const baseURL = process.env.NODE_ENV === 'development' ? '/api' : 'http://ceshi13.dishait.cn';

export const get_curImageList = ({id, page = 1, limit = 10}) => request(URL.IMAGECLASS_ID.replace(':id', id).replace(':page', page), 'GET', { limit })

export const delete_image_api = ({ids = []} = {ids: []}) => request(URL.DELETEIMAGE, 'POST', { ids })

export const update_image_name = ({id, name = ''}) => request(URL.UPDATE_IMAGE_NAME.replace(':id', id), 'POST', { name })

// export const upload_image = ({image_class_id, img}) => request(URL.UPLOAD_IMAGE, 'POST', { image_class_id, img })

export const upload_image = baseURL + URL.UPLOAD_IMAGE
