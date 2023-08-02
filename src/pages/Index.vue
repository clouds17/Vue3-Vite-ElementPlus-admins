<template>
    <div>
        后台首页{{ $store.getters.user }}
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const user = computed(() => store.getters.user)
console.log('user', user.value)
</script>

<style lang="scss" scoped>

</style>