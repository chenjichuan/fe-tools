<template>
  <div class="mod-chat mod-chat-glb">
    <Modal
      v-model="modal"
      draggable scrollable
      footer-hide
      :mask-closable="false"
      class-name="chat-main-content"
      width="900">
      <div slot="header">
        <Header class="header noselect">
          <h2 style="color: #fff;font-weight: 500;letter-spacing: 1px;">基于 WebSocket 即时会话</h2>
          <template v-if="authUser.avatar">
            <Avatar :src="authUser.avatar" size="large" class="me"/>
          </template>
          <template v-else>
            <Avatar icon="logo-snapchat" size="large" class="me"/>
          </template>
        </Header>
      </div>
      <Layout class="chat-model">
        <Sider hide-trigger class="asside left">
          <div
            @click="activeWin = {userId: '0'}"
            class="qun noselect hover"
            :class="{slected: activeWin.userId === '0'}">
            <Badge :count="0">
              <Avatar size="large" style="color: #f56a00;background-color: #fde3cf">ALL</Avatar>
            </Badge>
            <span>&nbsp;&nbsp;&nbsp;全组</span>
          </div>
          <ul class="noselect">
            <li
              :class="{slected: activeWin.userId === item.userId}"
              @click="openTab(item)"
              class="member hover"
              v-for="(item, index) in members"
              v-if="item.userId !== authUser.userId"
              :key="index">
              <Badge :count="item.count">
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
              </Badge>
              <span
                style="margin-left: 10px"
                :class="{offline: onlinePeople.indexOf(item.userId) === -1}">
                {{ item.nickname || item.username }}
              </span>
            </li>
          </ul>
        </Sider>
        <Layout>
          <Content id="window-chat" class="content" v-scroll>
            <transition name="fade">
              <ChatBox
                v-if="mem.userId === activeWin.userId"
                v-for="mem in chatBord"
                :key="mem.userId"
                :mem="mem"
                :packages="hotmessges"/>
            </transition>
          </Content>
          <Footer class="type-area">
            <i-input
              v-model="valueLer"
              type="textarea"
              :rows="5"
              class="input-area"
              @on-keydown="keydown"
              @on-keyup="keyup"
              @on-enter="sendMsg"/>
            <Button id="send" type="success" :disabled="disabledSend" @click="sendMsg">发送</Button>
          </Footer>
        </Layout>
      </Layout>
    </Modal>
  </div>
</template>

<script>
  import ChatBox from '@/components/chat-box'
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
    components: {ChatBox},
    asyncData({store}) {
    },
    data() {
      return {
        modal: false,
        valueLer: '',
        activeWin: {
          userId: '0'
        },
        chatBord: [{userId: '0'}],
        members: [],
        onlinePeople: [],
        hotmessges: {}
      }
    },
    computed: {
      ...mapState(['authUser']),
      disabledSend() {
        return !Boolean(this.valueLer.trim())
      }
    },
    watch: {},
    created() {
      if (process.client) {
        getAllUser().then(res => {
          this.members = res.data.map(item => ({...item, count: 0}));
          const ids = res.data.map(item => ({userId: item.userId}))
          this.chatBord = this.chatBord.concat(ids);
          this.chatBord.forEach(item => {
            this.$set(this.hotmessges, item.userId, []);
          });
        })
        socket.emit('online', this.authUser.userId, (memberlist) => {
          this.onlinePeople = memberlist;
        });
      }
    },
    beforeMount() {
      socket.on('freshMembers', (memberlist) => {
        this.onlinePeople = memberlist;
      })

      const dataRecieve = (key, data, type) => {
        // 找到是谁发的
        this.members.forEach(item => {
          if (item.userId === data.userId) {
            if (!this.hotmessges[key]) {
              this.hotmessges[key] = [];
            }
            const newItem = {
              ...item,
              type: data.type,
              dateTime: data.dateTime,
              message: data.message
            }
            this.hotmessges[key].push(newItem);
            if (this.hotmessges[key].length >= 200) {
              this.hotmessges[key].shift();
            }
            // 非群发
            if (this.activeWin.userId !== item.userId && type !== 'all') {
              item.count += 1;
            }
          }
        })
        setTimeout(() => {
          const el = document.getElementById('window-chat');
          el.scrollTop = el.scrollHeight
        })
      }

      socket.on('get message form all', (data) => {
        dataRecieve('0', data, 'all')
      });

      socket.on('get secret message', (data) => {
        data.userId = data.from;
        dataRecieve(data.from, data)
      });
    },
    mounted() {
      this.modal = true;
    },
    beforeDestroy() {
      socket.emit('offline', this.authUser.userId)
      socket.removeAllListeners(['get message form all', 'freshMembers', 'get secret message']);
    },
    methods: {
      openTab(item) {
        item.count = 0;
        this.activeWin = item;
      },
      keyup(e) {
        var code = e.keyCode;
        if (code === 91 || code === 229) {
          this.CtrlCommand = false
        }
      },
      keydown(e) {
        var code = '';
        if (!e) {
          var e = window.event;
        }
        if (e.keyCode) {
          code = e.keyCode;
        } else if (e.which) {
          code = e.which;
        }
        if (code === 13) {
          // 阻止原生的回车
          e.preventDefault();
        }
        // console.log(code, this.CtrlCommand)
        if (code === 13) {
          e.returnValue = false;
        }
        if (this.CtrlCommand && code === 13) { // 换行
          this.valueLer += '\n'
        }
        // console.log(code)
        if (code === 91 || code === 229) { // command
          this.CtrlCommand = true
        }
        setTimeout(() => {
          const el = document.querySelector('.input-area > textarea');
          el.scrollTop = el.scrollHeight
        })
      },
      sendMsg() {
        if (this.disabledSend) return
        const dataDeal = (key, params) => {
          if (!this.hotmessges[key]) {
            this.hotmessges[key] = [];
          }
          this.hotmessges[key].push({
            ...this.authUser,
            type: 'send',
            message: params.message
          })
          if (this.hotmessges[key].length >= 200) {
            this.hotmessges[key].shift();
          }
          this.valueLer = '';
        }
        const sendBoard = (params) => {
          socket.emit('dispach message', params, () => {
            dataDeal('0', params)
          })
        }
        const sendSolo = (params) => {
          socket.emit('secret message', params, () => {
            dataDeal(params.to, params)
          })
        }
        let trimed = this.valueLer.replace(/[\r\n]$/g, '').trim();
        if (this.activeWin.userId === '0') {
          const params = {
            userId: this.authUser.userId,
            message: trimed
          }
          sendBoard(params);
        } else {
          const params = {
            from: this.authUser.userId,
            to: this.activeWin.userId,
            message: trimed
          }
          sendSolo(params)
        }
      }
    }
  }
</script>
<style lang="scss">
  .mod-chat-glb {
    background-color: #fff;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
    opacity: 0.5;
    z-index: -1;
    position: relative;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
<style lang="scss">
  @import "./index.scss";
</style>


