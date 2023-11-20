<script setup lang="ts">
import { getCaptcha } from '@/api/login/login';

const click = () => {
    getCaptcha().then((res) => {
        console.log(res);
    });
};
</script>

<template>
    <div>
        <div class="w-20 h-20 bg-amber-200 rounded-2xl" @click="click">request</div>
        <div class="text-cyan-400">123</div>
        <div class="text-ty-main">自定义的样式</div>
    </div>
</template>
