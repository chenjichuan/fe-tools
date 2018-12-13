<style lang="less" scoped>
  @import './login.less';
</style>

<template>
  <!--<div class="login" :class="{'img-done': !loading}">-->
  <div class="login">
    <Loading v-if="loading" />
    <canvas id="c" width="2560" height="404" />
    <transition name="fade">
      <div v-if="!loading" class="login-con">
        <Card
          :bordered="false"
          icon="log-in"
          title="欢迎登录">
          <div class="form-con">
            <login-form @on-success-valid="handleSubmit" />
            <p class="login-tip">新用户任意账号密码注册</p>
          </div>
        </Card>
      </div>
    </transition>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import LoginForm from '@/components/login-form'
// import LoginBg from '@/assets/images/login-bg.jpg';
import bgGo from './bg'
import { mapActions } from 'vuex'
export default {
  layout: 'blank',
  components: {
    LoginForm, Loading
  },
  data () {
    return{
      loading: true
    }
  },
  mounted() {
    // const bg = new Image()
    // bg.onload = () => {
    //   this.loading = false;
    // }
    setTimeout(() => {
      this.loading = false;
      bgGo(window)
    }, 2000);

  },
  methods: {
    ...mapActions([
      'login'
    ]),
    handleSubmit ({ username, password }) {
      this.login({ username, password }).then(() => {
        this.$router.push('home')
        this.$Message.success('登录成功');
      }, (res) => {
        this.$Message.error(res.error);
      })
    }
  }
}
</script>

