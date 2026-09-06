<template>
  <!-- 路由出口，页面根据router配置渲染 -->
  <router-view />
</template>

<script setup>
// 顶层根组件，无需额外业务代码
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
}
</style>

