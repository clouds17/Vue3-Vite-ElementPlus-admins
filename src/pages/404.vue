<template>
    <div class="wrap">
        <img :src="$baseImg + '404.png'" alt="">
        <div class="text">
            <p>很抱歉</p>
            <p>您访问的页面出错了</p>
            <p class=" mt-2"><router-link class="link" to="/">点击这里</router-link>&nbsp;&nbsp;&nbsp;&nbsp;<span>返回</span>&nbsp;<span>首页</span></p>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.wrap {
    max-width: 1000px;
    height: 407px;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
}
.wrap img {
    max-width: 910px;
    width: 100%;
}
.wrap .text {
    position: absolute;
    right: 0;
    bottom: 100px;
}
p {
    font-size: 22px;
    color: #0095F4;
    line-height: 1.5;
}
p a {
    color: #F68C22;
}
</style>