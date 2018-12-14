<template>
  <Form
    ref="loginForm"
    :model="form"
    :rules="rules"
    @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <i-input
        v-model="form.username"
        :maxlength="20"
        placeholder="请输入用户名">
        <span slot="prepend">
          <Icon
            :size="16"
            type="ios-person"/>
        </span>
      </i-input>
    </FormItem>
    <FormItem prop="password">
      <i-input
        v-model="form.password"
        type="password"
        :maxlength="11"
        placeholder="请输入密码">
        <span slot="prepend">
          <Icon
            :size="14"
            type="md-lock"/>
        </span>
      </i-input>
    </FormItem>
    <FormItem>
      <Button
        long
        type="primary"
        @click="handleSubmit"
      >登录
      </Button>
    </FormItem>
  </Form>
</template>
<script>
  export default {
    props: {
      userNameRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ]
        }
      },
      passwordRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    computed: {
      rules() {
        return {
          username: this.userNameRules,
          password: this.passwordRules
        }
      }
    },
    created() {
      const dev = !(process.env.NODE_ENV === 'production');
      if(dev) {
        this.form = {
          username: 'demo',
          password: 'demo'
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$emit('on-success-valid', {
              username: this.form.username,
              password: this.form.password
            })
          }
        })
      }
    }
  }
</script>
