<template>
  <div class="mod-chat mod-chat-glb">
    <div class="chat-main-content">
      <Header class="header noselect">
        <h2 style="color: #fff;font-weight: 500;letter-spacing: 1px;">基于 WebSocket 即时会话</h2>
        <Dropdown trigger="click">
          <Badge :count="1">
            <template v-if="$store.state.authUser.avatar">
              <Avatar :src="$store.state.authUser.avatar" size="large" class="me"/>
            </template>
            <template v-else>
              <Avatar icon="logo-snapchat" size="large" class="me"/>
            </template>
          </Badge>
          <DropdownMenu slot="list">
            <DropdownItem>上线</DropdownItem>
            <DropdownItem>下线</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Header>
      <Layout class="chat-model">
        <Sider hide-trigger class="asside left">
          <div
            @click="activeWin = {userId: '0'}"
            class="qun noselect hover"
            :class="{slected: activeWin.userId === '0'}">
            <Avatar size="large" style="color: #f56a00;background-color: #fde3cf">ALL</Avatar>
            <span>&nbsp;&nbsp;&nbsp;全组</span>
          </div>
          <ul class="noselect">
            <li
              :class="{slected: activeWin.userId === item.userId}"
              @click="openSolo(item)"
              class="member hover"
              v-for="(item, index) in members"
              v-if="item.userId !== authUser.userId"
              :key="index">
              <template v-if="item.avatar">
                <Avatar
                  :class="{offline: onlinePeople.indexOf(item.userId) === -1}"
                  style="background: #00a2ae" :src="item.avatar"
                  size="large"/>
              </template>
              <template v-else>
                <Avatar
                  :class="{offline: onlinePeople.indexOf(item.userId) === -1}"
                  style="background: #00a2ae" icon="ios-person"
                  size="large"/>
              </template>
              <span
                style="margin-left: 10px"
                :class="{offline: onlinePeople.indexOf(item.userId) === -1}">
                {{ item.nickname || item.username }}
              </span>
            </li>
          </ul>
        </Sider>
        <Layout>
          <Content class="content" v-scroll>
            <ul>
              <template v-for="(item, index) in hotmessges">
                <li class="recieve-msg flex" v-if="item.type === 'recieve'" :key="index">
                  <template v-if="item.avatar">
                    <Avatar shape="square" :src="item.avatar" size="large"/>
                  </template>
                  <template v-else>
                    <Avatar style="background: #00a2ae" shape="square" icon="ios-person" size="large"/>
                  </template>
                  <div class="right-area">
                    <h3>{{ item.nickname || item.username }}</h3>
                    <pre class="word">{{ item.message }}</pre>
                  </div>
                </li>

                <li class="post-msg flex" v-else :key="index">
                  <div class="left-area">
                    <pre class="word">{{ item.message }}</pre>
                  </div>
                  <template v-if="item.avatar">
                    <Avatar shape="square" :src="item.avatar" size="large"/>
                  </template>
                  <template v-else>
                    <Avatar style="background: #00a2ae" shape="square" icon="ios-person" size="large"/>
                  </template>
                </li>
              </template>

            </ul>

          </Content>
          <Footer class="type-area">
            <i-input
              v-model="valueLer"
              type="textarea"
              :rows="5"
              class="input-area"/>
            <Button id="send" type="success" :disabled="disabledSend" @click="sendMsg">发送</Button>
          </Footer>
        </Layout>
      </Layout>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {getAllUser} from './api';

  export default {
    directives: {
      scroll: {
        // 指令的定义
        update: function (el) {
          setTimeout(() => {
            el.scrollTop = el.scrollHeight
          })
        }
      }
    },
    components: {},
    asyncData({store}) {
    },
    data() {
      return {
        valueLer: '',
        activeWin: {
          userId: '0'
        },
        members: [],
        onlinePeople: [],
        hotmessges: []
      }
    },
    computed: {
      ...mapState(['authUser']),
      disabledSend() {
        return !Boolean(this.valueLer.trim())
      }
    },
    watch: {
      hotmessges() {

      }
  },
    beforeMount() {
      socket.on('freshMembers', (memberlist) => {
        this.onlinePeople = memberlist;
      })
      socket.on('get message form all', (data) => {
        for (var item of this.members) {
          if (item.userId === data.userId) {
            this.hotmessges.push({
              ...item,
              type: data.type,
              message: data.message
            })
            if (this.hotmessges.length >= 200) {
              this.hotmessges.shift();
            }
            break;
          }
        }
        console.log(data)
      });
    },
    mounted() {
      getAllUser().then(res => {
        this.members = res.data
      })
      socket.emit('online', this.authUser.userId, (memberlist) => {
        this.onlinePeople = memberlist;
      });
    },
    beforeDestroy() {
      socket.emit('offline', this.authUser.userId)
      socket.removeAllListeners(['get message form all', 'freshMembers']);
    },
    methods: {
      openSolo(item) {
        this.activeWin = item;
      },
      sendMsg() {
        let trimed = this.valueLer.replace(/[\r\n]$/g, '').trim();
        const params = {
          userId: this.authUser.userId,
          message: trimed
        }
        socket.emit('dispach message', params, () => {
          this.hotmessges.push({
            ...this.authUser,
            type: 'send',
            message: trimed
          })
          if (this.hotmessges.length >= 200) {
            this.hotmessges.shift();
          }
          this.valueLer = '';
        })
      }
    }
  }
</script>
<style lang="scss">
  .mod-chat-glb {
    background-color: #fff;
    .ivu-layout-sider {
      background-color: rgb(245, 245, 245);
    }
    .content,
    textarea.ivu-input {
      border: none;
      resize: none;
      &:focus {
        box-shadow: none;
      }
      &::-webkit-scrollbar { /*滚动条整体样式*/
        width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(82, 74, 74, 0.32);
      }
      &::-webkit-scrollbar-track { /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.0);
        border-radius: 10px;
        /*background: #EDEDED;*/
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import "./index.scss";
  .flex {
    display: flex;
    justify-content: flex-start;
  }

</style>


