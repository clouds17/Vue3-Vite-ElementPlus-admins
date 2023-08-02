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



### loading进度条

- 插件： nprogress
- 地址： https://www.npmjs.com/package/nprogress

