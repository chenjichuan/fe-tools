<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick" v-if="authUser.username">
      <Badge>
        <Avatar :src="userAvator" size="large" v-if="userAvator"/>
        <Avatar icon="ios-person" size="large" v-else />
      </Badge>
      <span class="name">{{ authUser.nickname || authUser.username }}</span>
      <Icon :size="18" type="md-arrow-dropdown"/>
      <DropdownMenu slot="list">
        <DropdownItem name="setting">个人设置</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'User',
    props: {
      userAvator: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapState(['authUser'])
    },
    methods: {
      ...mapActions([
        'logout'
      ]),
      logoutHandler() {
        this.logout().then(() => {
          this.$router.push({
            name: 'login'
          })
        })
      },
      message() {
        this.$router.push({
          name: 'message_page'
        })
      },
      handleClick(name) {
        switch (name) {
          case 'logout':
            this.logoutHandler()
            break
          case 'setting':
            this.$router.push('/setting')
            break
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .name {
    color: rgba(0,0,0,.65);
    font-size: 14px;
    cursor: pointer;
    padding: 0 5px;
  }
</style>
