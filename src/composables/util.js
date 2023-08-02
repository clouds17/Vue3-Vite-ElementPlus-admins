import { ElNotification, ElMessage, ElMessageBox } from 'element-plus';

// 成功提示
export function toast(message = '成功', type = 'success', dangerouslyUseHTMLString = false) {
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000
    })
}

export function MessageBox(message='提示内容', type='warning', title='', confirmButtonText='确定', cancelButtonText='取消') {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(
            message,
            title,
            {
              confirmButtonText,
              cancelButtonText,
              type,
            }
          )
            .then(() => {
              resolve('确定')
            })
            .catch(() => {
              reject('取消')
            })
    })
}

export function Message(message='成功', type='success') {
    ElMessage({
        type,
        message,
    })
}