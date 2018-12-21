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
                  :class="{offline: onMember.indexOf(item.userId) === -1}"
                  style="background: #00a2ae" :src="item.avatar"
                  size="large"/>
              </template>
              <template v-else>
                <Avatar
                  :class="{offline: onMember.indexOf(item.userId) === -1}"
                  style="background: #00a2ae" icon="ios-person"
                  size="large"/>
              </template>
              <span
                style="margin-left: 10px"
                :class="{offline: onMember.indexOf(item.userId) === -1}">
                {{ item.nickname || item.username }}
              </span>
            </li>
          </ul>
        </Sider>
        <Layout>
          <Content class="content">
            <!--<pre>{{ valueLer }}</pre>-->
            <div class="recieve-msg flex">
              <template v-if="authUser.avatar">
                <Avatar shape="square" :src="authUser.avatar" size="large"/>
              </template>
              <template v-else>
                <Avatar style="background: #00a2ae" shape="square" icon="ios-person" size="large"/>
              </template>
              <div class="right-area">
                <h3>{{ authUser.nickname || authUser.username }}</h3>
                <pre class="word"> 3  adasdasdasdasdasdasd
                  3e</pre>
              </div>
            </div>
            <div class="post-msg flex">
              <div class="left-area">
                <pre class="word"> 3  adasdasdasdasdasdasd
                  3e</pre>
              </div>
              <template v-if="authUser.avatar">
                <Avatar shape="square" :src="authUser.avatar" size="large"/>
              </template>
              <template v-else>
                <Avatar style="background: #00a2ae" shape="square" icon="ios-person" size="large"/>
              </template>
            </div>
          </Content>
          <Footer class="type-area">
            <i-input
              v-model="valueLer"
              type="textarea"
              :rows="5"
              class="input-area"/>
            <Button id="send">发送</Button>
          </Footer>
        </Layout>
      </Layout>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import {getAllUser} from './api';

  export default {
    components: {},
    asyncData({store}) {
    },
    data() {
      return {
        valueLer: '',
        activeWin: false,
        members: [],
        onMember: []
      }
    },
    computed: {
      ...mapState(['authUser']),
    },
    beforeMount() {
      socket.on('freshMembers', (member) =>{
        console.log(member)
        this.onMember = member;
      })
    },
    mounted() {
      getAllUser().then(res => {
        this.members = res.data
      })
      socket.emit('online', this.authUser.userId)
    },
    beforeDestroy() {
      socket.emit('offline', this.authUser.userId)
      socket.removeAllListeners(['freshMembers']);
    },
    methods: {
      openSolo(item) {
        this.activeWin = item;
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
  .flex {
    display: flex;
    justify-content: flex-start;
  }
  .mod-chat {
    background: url("../../assets/images/chat_image.jpg");
    background-size: cover;
    width: 100%;
    margin: -24px;
    margin-right: -24px;
    padding: 60px 20px;
    flex: 1;
    .chat-main-content {
      min-width: 900px;
      width: 60%;
      margin: 0 auto;
    }
    .header {
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      height: 70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      z-index: 1;
      position: relative;
      .me {
        cursor: pointer;
      }
    }
    .chat-model {
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      box-shadow: 5px 5px 15px 0 hsla(0, 0%, 84%, .15);
      overflow: hidden;
      min-height: 700px;
      .type-area, .content, .asside {
        background-color: #fff;
      }
      .content {
        padding-top: 20px;
        background-color: #fff;
        overflow: auto;
        max-height: 700px;
        .word {
          background-color: #fff;
          border-radius: 4px;
          border: 1px solid #dde2ea;
          padding: 8px;
        }
        .right-area {
          margin-left: 10px;
        }
        .left-area {
          margin-right: 10px;
        }
        .recieve-msg {
          margin: 10px 0 0 20px;
        }
        .post-msg {
          justify-content: flex-end;
          margin: 10px 20px 0 0px;
          .word {
            background-color: #b8d45c;
          }
        }
      }
      .asside {
        &.left {
          border-right: 1px solid #ededed;
        }
        &.right {
          border-left: 1px solid #ededed;
        }
        .qun {
          height: 75px;
          cursor: pointer;
          padding-left: 28px;
          /*background-color: #fbfbfb;*/
          padding-top: 16px;
          &.slected {
            background-color: #ebf7ff;
          }
        }
        .member {
          padding: 14px 30px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          cursor: pointer;
          .offline {
            @include gray();
          }
          &.slected {
            background-color: #ebf7ff;
            @include gray-no();
          }
          &.hover {
            &:hover {
              background-color: rgba(235, 247, 255, 0.46);
            }
          }
        }

      }
      .type-area {
        border-top: 1px solid #ededed;
        min-height: 120px;
        padding: 0;
        padding-bottom: 10px;
        .input-area {
          height: 100%;
        }
        #send {
          float: right;
          margin-right: 10px;
          padding: 10px 25px;
        }
      }
    }
  }

</style>


