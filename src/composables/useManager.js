import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { MessageBox, toast } from '~/composables/util.js'



// 修改密码
export const useRepassword = () => {

    const store = useStore()
    const router = useRouter()

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

// 退出登录
export const useLogout = () => {
    
    const store = useStore()
    const router = useRouter()

    function handleLogout() {
        MessageBox('是否要退出登录?')
            .then(res => {
                store.dispatch('Logout')
                    .then(res => {
                        router.push('/login')
                        toast('退出登录成功')
                    })
            })
    }

    return {
        handleLogout
    }
}


