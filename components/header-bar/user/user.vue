<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <Avatar :src="userAvator" size="large" v-if="userAvator"/>
        <Avatar icon="ios-person" size="large" v-else />
      </Badge>
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
  import { mapActions } from 'vuex'

  export default {
    name: 'User',
    props: {
      userAvator: {
        type: String,
        default: ''
      }
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
