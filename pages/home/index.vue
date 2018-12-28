<template>
  <div class="mod-home">
    <footer class="footer">
      <a href="https://github.com/chenjichuan/fe-tools" target="_blank" class="github">
        <Icon type="logo-github" />
      </a>
      <div class="copyright">
        Copyleft <i class="trans">©</i> 2018. Started in Dcember
      </div>
    </footer>
  </div>
</template>

<script>
  import Logo from '~/components/Logo.vue'

  export default {
    components: {Logo},
    data() {
      return {
        tranclass: ''
      }
    },
    mounted() {
      this.tranclass = 'rotateIn'
    }
  }
</script>

<style scoped lang="less">
  @import "./index";
</style>
