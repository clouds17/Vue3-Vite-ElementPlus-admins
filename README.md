# Vue 3 + Vite

### 配置路径别名
> 在vite.config.js目录下引入path模块
```javascript
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, 'src')
    }
  },
})
```



### 本地开发请求接口跨域问题

- 文档： https://cn.vitejs.dev/config/server-options.html#server-proxy

  - vite官网 => 配置 => 服务器选项 => server.proxy

- 配置

  - 在vite.config.js文件

    ```
    export default defineConfig({
      server: {
        proxy: {
          '/api': {
            target: 'http://ceshi13.dishait.cn',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        }
      },
    ```

  - 上面表示用/api来代替baseurl

  - 所以axios配置

    ```
    const baseURL = process.env.NODE_ENV === 'development' ? '/api' : 'http://ceshi13.dishait.cn';
    const instance = axios.create({
        baseURL,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
    ```

    





### Vue3表单验证

- template

```html
<el-form :rules="rules" ref="formRef" :model="form" class="w-[250px]">
    <el-form-item prop="username">
        <el-input size="large" v-model="form.username" placeholder="请输入用户名" >
            <template #prefix>
                <el-icon><User /></el-icon>
            </template>
        </el-input>
    </el-form-item>
    <el-form-item prop="password">
        <el-input type="password" show-password size="large" v-model="form.password" placeholder="请输入密码" >
            <template #prefix>
                <el-icon><Lock /></el-icon>
            </template>
        </el-input>
    </el-form-item>
    <el-form-item>
        <el-button class="w-[250px]" round color="#626aef" size="large"
                   type="primary" @click="onSubmit">登 录</el-button>
    </el-form-item>
</el-form>

// 定义一个 rules用来验证
// ref 用来点击登录按钮的时候验证
// el-form-item 上添加 prop 确认当前模块使用哪个规则
```

- sctipt

```javascript
<script setup>
import { reactive, ref } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'

// 定义表单对象
const form = reactive({
    username: '',
    password: ''
})
// 定义表单规则
const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
}
// 调用标签里的ref时，需要先用ref(null)
const formRef = ref(null)
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return false;
       	console.log('验证通过')
    })
}
</script>
```



### Vue3路由跳转

> 在Vue2中跳转直接用this.$router.push()
>
> Vue3中不行，用法如下

```javascript
<script setup>
// 先引入 useRouter
import { useRouter } from 'vue-router'
// 调用一下useRouter()方法并赋值给router
const router = useRouter()
const submit = () => {
    router.push('/')
}
</script>
```



### 使用VueUse设置cookie

- useCookies

- 文档： https://vueuse.org/integrations/useCookies/#usecookies

- 先npm 引入

  - `npm i @vueuse/integrations`

  - `npm i universal-cookie`

  ```javascript
  <script setup>
    import { useCookies } from '@vueuse/integrations/useCookies'
    const cookies = useCookies()
    // 设置
    cookies.set('admin-token', '1232344')
    // 获取
    cookies.get('admin-token')
    // 删除
    cookies.remove('admin-token')
  </script>
  ```



### 使用VueUse设置全屏

- usefullscreen

- 文档： https://vueuse.org/core/useFullscreen/#usefullscreen

- 先npm 引入核心包

  - `npm i @vueuse/core`

  ```
  import { useFullscreen } from '@vueuse/core'
  
  const { isFullscreen, enter, exit, toggle } = useFullscreen()
  
  // isFullscreen： 是否全屏的变量
  // enter: 进去全屏的方法
  // exit: 取消全屏的方法
  // toggle: 切换的方法
  ```

  

### loading进度条

- 插件： nprogress

- 地址： https://www.npmjs.com/package/nprogress

- 步骤

  - 下载: `npm i nprogress`

  - main.js里引入样式： `import 'nprogress/nprogress.css'`

  - ```javascript
    // 开始
    NProgress.start();
    // 结束
    NProgress.done();
    ```

  - 在全局守卫里调用

    ```
    import NProgress from 'nprogress';
    // 全局前置守卫
    router.beforeEach(async (to, from, next) => {
        // 显示loading
        NProgress.start();
    }）
    // 全局后置守卫
    router.afterEach((to, from) => {
        // 隐藏loading
        NProgress.done();
    })
    ```

    



### 动态设置页面标题

- 现在router里面的每个路由设置meta的title

  ```
  	{ 
          path: '/',
          meta: {
              title: '后台首页'
          },
          component: () => import('~/pages/Index.vue')
      },
      {
          path: '/login',
          meta: {
              title: '登录页'
          },
          component: () => import('~/pages/Login.vue')
      }
  ```

- 在全局前置守卫里面设置

  ```
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
  
      // 设置页面标题
      const title = (to.meta.title ? to.meta.title + '-' : '') + '小黄的商城'
      document.title = title
  
      next()
  })
  ```

  

### 组合式api封装简化

- 当script里面的代码太多了，太乱了，我们可以多它进行一个封装，方便维护

```
// 修改密码相关的代码，已经有几十行了，那如果页面中有好几个这样的代码，后期维护起来就很乱
const form = reactive({
        oldpassword: '', 
        password: '',
        repassword: ''
    })
    // 验证密码
    const checkPass = (rule, value, callback) => {
        const reg =  /^(?=.*\d).{5,16}$/
        if (!reg.test(value)) {
            return callback(new Error("密码至少包含一个数字"))
        }
        callback()
    }
    // 验证确认密码
    const checkRePass = (rule, value, callback) => {
        if (value !== form.password) {
            return callback(new Error("密码不一致"))
        }
        callback()
    }
    const rules = {
        oldpassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
            { validator: checkPass, trigger: 'blur' }
        ],
        repassword: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
            { validator: checkRePass, trigger: 'blur' }
        ]
    }

    const formRef = ref(null)
    const formDrawerRef = ref(null)

    function onClose() {
        form.oldpassword = form.password = form.repassword = ''
    }

    // 提交密码
    function onSubmit() {
        formRef.value.validate((valid) => {
            if (!valid) return false;
            // 显示loading
            formDrawerRef.value.showLoading()

            store.dispatch('UpdatePassword', form)
                .then(res => {
                    // 关闭抽屉
                    formDrawerRef.value.close()
                    toast('密码修改成功,请重新登录')

                    return store.dispatch('Logout')
                })
                .then(res => {
                    router.push('/login')
                })
                .finally(() => {
                    // 隐藏loading
                    formDrawerRef.value.hideLoading()
                })
        })
    }
```

- 可以定义个方法给它包起来，再导出来，也可以把它放到别的文件里

  ```
  // 修改密码
  const useRepassword = () => {
  
      const form = reactive({
          oldpassword: '', 
          password: '',
          repassword: ''
      })
      // 验证密码
      const checkPass = (rule, value, callback) => {
          const reg =  /^(?=.*\d).{5,16}$/
          if (!reg.test(value)) {
              return callback(new Error("密码至少包含一个数字"))
          }
          callback()
      }
      // 验证确认密码
      const checkRePass = (rule, value, callback) => {
          if (value !== form.password) {
              return callback(new Error("密码不一致"))
          }
          callback()
      }
      const rules = {
          oldpassword: [
              { required: true, message: '请输入旧密码', trigger: 'blur' },
              { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
          ],
          password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
              { validator: checkPass, trigger: 'blur' }
          ],
          repassword: [
              { required: true, message: '请输入确认密码', trigger: 'blur' },
              { min: 5, max: 16, message: '密码长度为5到16个字符', trigger: 'blur' },
              { validator: checkRePass, trigger: 'blur' }
          ]
      }
  
      const formRef = ref(null)
      const formDrawerRef = ref(null)
  
  
      function onClose() {
          form.oldpassword = form.password = form.repassword = ''
      }
  
      // 提交密码
      function onSubmit() {
          formRef.value.validate((valid) => {
              if (!valid) return false;
              // 显示loading
              formDrawerRef.value.showLoading()
  
              store.dispatch('UpdatePassword', form)
                  .then(res => {
                      // 关闭抽屉
                      formDrawerRef.value.close()
                      toast('密码修改成功,请重新登录')
  
                      return store.dispatch('Logout')
                  })
                  .then(res => {
                      router.push('/login')
                  })
                  .finally(() => {
                      // 隐藏loading
                      formDrawerRef.value.hideLoading()
                  })
          })
      }
  
      return {
          form,
          rules,
          formRef,
          formDrawerRef,
          onSubmit,
          onClose
      }
  }
  
  
  // 引入
  // 修改密码
  const {
      form,
      rules,
      formRef,
      formDrawerRef,
      onSubmit,
      onClose
  } = useRepassword()
  ```

  这样当之后修改维护这个模块时看起来就比较清晰



### gsap动效库实现数字滚动动画

- `npm i gsap`

- ```
  // 封装成组件
  
  <template>
      {{ d.num.toFixed(0) }}
  </template>
  
  <script setup>
  import { reactive, watch } from "vue";
  import gsap from 'gsap'
  
  const props = defineProps({
      value: {
          type: Number,
          default: 0
      }
  })
  
  const d = reactive({
      num: 0
  })
  
  function AnimateToValue() {
      gsap.to(d, {
          duration: 0.5,
          num: props.value
      })
  }
  
  AnimateToValue()
  
  watch(() => props.value, () => AnimateToValue())
  
  </script>
  
  ```




### 指令控制权限

> 后台管理系统会根据角色的权限控制显示哪些模块信息

1. 首先：

   - 用户返回的角色权限数据

   ```js
   "ruleNames": [
        "createRule,POST",
        "updateRule,POST",
        "deleteRule,POST",
        "getRuleList,GET",
        "updateRuleStatus,POST",
        "createRole,POST",
        "updateRole,POST",
        "deleteRole,POST",
        "getRoleList,GET",
        "updateRoleStatus,POST",
        "getGoodsList,GET"
    ]
    // 这是我用户返回的角色权限数据，具体和后端商量
   ```

   

2. 自定义全局指令

   - /src/directive/permission.js

   ```js
   // 我把角色权限的数据放在了 store.getters.ruleNames 里
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
       // 用app.use导入，可以被当成定义在一个install的函数下调用，函数的参数就是app
       install(app) {
           // 指令权限控制
           app.directive('permission', {
               mounted(el, binding) {
                   hasPermission(binding.value, el)
               }
           })
       }
   }
   ```

   - main.js

   ```js
   // 指令权限控制
   import permission from './directive/permission.js'
   app.use(permission)
   ```

   - 用法

   ```vue
   // 如果ruleNames里面有'getStatistics3,GET'，该模块显示，如果没有则不显示
   <div v-permission="['getStatistics3,GET']"></div>
   ```




### 组件内查看父组件引用有没有使用插槽

```
<template>
	<div>
		//默认插槽
		<slot/>
		// 具名插槽
		<slot name="show"/>
	</div>
</template>
<script setup>
import { ref, useSlots } from 'vue';

// 查看父组件引用有没有使用插槽
const slots = useSlots()
console.log('slots', slots)
// slots里面如果有show函数表示父组件使用时用了具名插槽
// slots里面如果有default函数表示父组件使用时用了默认插槽
const hasShowSearch = ref(!!slots.show)

</script>
```



### 导出下载Excel文件

1. 设置接口响应类型

   - 下载文件，那么后端接口返回来的应该是一个文件流
   - 所以接口应该设置响应类型： `responseType: 'blob'`

2. 得到接口响应数据后

   ```
   // 响应数据: data
   // 是一个blob数据
   // 转成url链接
   let url = Window.URL.createObjectURL(new Blob([ data ]))
   // 创建a标签
   let link = document.createElement("a")
   link.style.display = "none"
   link.href = url
   // 设置文件名
   let filename = Date.now() + ".xlsx"
   link.setAttribute("download", filename)
   document.body.appendChild(link)
   link.click()
   ```

   

