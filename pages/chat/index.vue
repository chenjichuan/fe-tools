<template>
  <div class="mod-chat mod-chat-glb">
    <Header class="header">
      <h2 style="color: #fff;font-weight: 500;letter-spacing: 1px;">基于 WebSocket 即时会话</h2>
      <Dropdown trigger="click">
        <Badge :count="1">
          <Avatar icon="logo-snapchat" size="large" class="me"/>
        </Badge>
        <DropdownMenu slot="list">
          <DropdownItem>上线</DropdownItem>
          <DropdownItem>下线</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Header>
    <Layout class="chat-model">
      <Sider hide-trigger class="asside left">
        <div class="qun">
          <Avatar size="large" style="color: #f56a00;background-color: #fde3cf">ALL</Avatar>
          <span>&nbsp;&nbsp;&nbsp;全组</span>
        </div>

      </Sider>
      <Layout>
        <Content class="content">Content</Content>
        <Footer class="type-area">
          <i-input
            v-model="valueType"
            type="textarea"
            :rows="6"
            class="input-area"/>
          <Button id="send">发送</Button>
        </Footer>
      </Layout>
      <Sider hide-trigger class="asside right">
        <ul>
          <li
            @dblclick="openSolo"
            class="member"
            v-for="(item, index) in members"
            :key="index">
            <Avatar style="background: #00a2ae" icon="ios-person"/>
            <span style="margin-left: 10px">{{ item.username }}</span>
          </li>
        </ul>
      </Sider>
    </Layout>
    <Modal v-model="solo" @hide="solo = false"/>
  </div>

</template>

<script>
  import Modal from '@/components/chat-modal'
  export default {
    components: { Modal },
    asyncData({store}) {
    },
    data() {
      return {
        valueType: '',
        solo: false,
        members: [{
          username: 1,
        }, {
          username: 2,
        }, {
          username: 3,
        }]
      }
    },
    created() {

    },
    methods:{
      openSolo() {
        this.solo = true;
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
    textarea.ivu-input{
      border: none;
      resize:none;
      &:focus {
        box-shadow: none;
      }
      &::-webkit-scrollbar {/*滚动条整体样式*/
        width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(82, 74, 74, 0.32);
      }
      &::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.0);
        border-radius: 10px;
        /*background: #EDEDED;*/
      }
    }
  }
</style>
<style lang="scss" scoped>
  .mod-chat {
    position: absolute;
    height: 100%;
    background: url("../../assets/images/chat_image.jpg");
    background-size: cover;
    width: 100%;
    left: 0;
    top: 0;
    padding-top: 100px;
    padding: 100px 20px;
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
      min-height: 600px;

      .type-area, .content, .asside {
        background-color: #fff;
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
          background-color: #fbfbfb;
          padding-top: 16px;
        }
        .member {
          padding: 14px 30px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          > span {
            cursor: pointer
          }
        }
      }
      .type-area {
        border-top: 1px solid #ededed;
        min-height: 130px;
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


