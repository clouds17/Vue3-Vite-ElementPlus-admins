import { ElNotification } from 'element-plus';

// 成功提示
export function toast(message = '成功', type = 'success', dangerouslyUseHTMLString = false) {
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000
    })
}