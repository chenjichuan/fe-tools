<template>
  <div id="root">
    <nuxt/>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    mounted() {
      if(window.socket) {
        socket.close(); //关闭当前链接
      }

    }
  }
</script>
<style lang="less">
</style>
