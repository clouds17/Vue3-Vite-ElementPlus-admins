import { ElNotification, ElMessageBox } from 'element-plus';
import nProgress from 'nprogress';

// 成功提示
export function toast(message = '成功', type = 'success', dangerouslyUseHTMLString = true) {
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000
    })
}
// 消息弹框
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

// 弹出输入框
export function showPrompt(message='', value='', title='') {
  return ElMessageBox.prompt(message, title, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value
  })
}

// 显示全屏loading
export function showFullLoading() {
    nProgress.start();
}

// 隐藏全屏loading
export function hideFullLoading() {
    nProgress.done();
}