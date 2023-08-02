<template>
    <div>
        <el-button type="primary" @click="logout">退出登录</el-button>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { MessageBox, toast } from '~/composables/util.js'

const store = useStore()
const router = useRouter()

function logout() {
    MessageBox('是否要退出登录?')
        .then(res => {
            console.log('确定退出')
            store.dispatch('Logout')
                .then(res => {
                    router.push('/login')
                    toast('退出登录成功')
                })
        })
}
</script>

<style lang="scss" scoped>

</style>