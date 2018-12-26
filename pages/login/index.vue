<style lang="less" scoped>
  @import './login.less';
</style>

<template>
  <div class="main-box">
    <!--背景-->
    <div class="login" :class="{'img-done': !loading}"/>

    <!--logo-->
    <transition name="fade">
      <div class="diy-logo" v-if="!loading">
      <span class="my-logo">
        <img src="../../assets/images/my-logo.png" alt="">
      </span>
        <span class="white-bg"/>
      </div>
    </transition>
    <!--登录框-->
    <transition name="fade">
      <div v-if="!loading" class="login-con">
        <Card
          :bordered="false"
          icon="log-in"
          title="欢迎登录">
          <div class="form-con">
            <login-form @on-success-valid="handleSubmit"/>
            <p class="login-tip">新用户任意账号密码注册</p>
          </div>
        </Card>
      </div>
    </transition>

    <!--预加载-->
    <Loading v-if="loading"/>
  </div>
</template>

<script>
  import Loading from '@/components/Loading'
  import LoginForm from '@/components/login-form'
  import LoginBg from '@/assets/images/login-bg.jpg';
  import {mapActions} from 'vuex'

  export default {
    layout: 'blank',
    components: {
      LoginForm, Loading
    },
    data() {
      return {
        loading: true
      }
    },
    mounted() {
      const bg = new Image()
      bg.onload = () => {
        this.loading = false;
      }
      bg.src = LoginBg
    },
    methods: {
      ...mapActions([
        'login'
      ]),
      handleSubmit({username, password}) {
        this.login({username, password}).then(() => {
          location.href = '/home'
          this.$Message.success('登录成功');
        }, (res) => {
          this.$Message.error(res.error);
        })
      }
    }
  }
</script>

