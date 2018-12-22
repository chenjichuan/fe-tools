<template>
  <div class="mod-home">
    <!--<Logo class="logo" :class="tranclass" style="opacity: 0;"/>-->
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
  .rotateIn {
    opacity: 0;
    animation: rotateIn 1s;
    animation-fill-mode: forwards;
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
    height: 85vh;
    overflow: auto;
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
    /*.logo {*/
    /*transform: rotate3d(0, 0, 1, -200deg);*/
    /*width: 500px;*/
    /*border-radius: 22px;*/
    /*overflow: hidden;*/
    /*}*/
    .footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      .copyright {
        color: rgba(0,0,0,.45);
        font-size: 14px;
      }
      .github {
        font-size: 30px;
        margin-bottom: 8px;
        display: block;
        color: rgba(0,0,0,.45);
        transition: all .3s;
      }
      .trans {
        display: inline-block;
        transform: rotate(180deg);
      }
    }
  }
</style>
