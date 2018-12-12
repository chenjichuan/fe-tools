<template>
  <div class="mod-home">
    <!--<Logo class="logo" :class="tranclass" style="opacity: 0;"/>-->
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
  .rotateIn {
    opacity: 0;
    animation: rotateIn 1s ;
    animation-fill-mode:forwards;
  }

  @-webkit-keyframes rotateIn {
    from {
      -webkit-transform-origin: center;
      transform-origin: center;
      -webkit-transform: rotate3d(0, 0, 1, -200deg);
      transform: rotate3d(0, 0, 1, -200deg);
      opacity: 0;
    }

    to {
      -webkit-transform-origin: center;
      transform-origin: center;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  @keyframes rotateIn {
    from {
      -webkit-transform-origin: center;
      transform-origin: center;
      -webkit-transform: rotate3d(0, 0, 1, -200deg);
      transform: rotate3d(0, 0, 1, -200deg);
      opacity: 0;
    }

    to {
      -webkit-transform-origin: center;
      transform-origin: center;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  .mod-home {
    width: 100%;
    position: relative;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      transform: rotate3d(0, 0, 1, -200deg);
      width: 500px;
      border-radius: 22px;
      overflow: hidden;
    }
  }
</style>
