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

// 上移
export function useArrayMoveUp(arr, index) {
  swapArray(arr, index, index - 1)
}

// 下移
export function useArrayMoveDown(arr, index) {
  swapArray(arr, index, index + 1)
}

function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(arguments, function(a, b) {
    var ret = [];
    a.forEach(function (a) {
      b.forEach(function (b) {
        ret.push(a.concat([b]))
      })
    })
    return ret
  }, [
    []
  ])
}