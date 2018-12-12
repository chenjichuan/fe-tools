<template>
  <div class="mod-setting">
    <Layout>
      <Content class="content">
        <h1>基本设置</h1>
        <Row type="flex" align="top" class="code-row-bg">
          <Col span="8" style="min-width: 200px;">
            <Form :model="formTop" label-position="top">
              <FormItem label="用户名" class="username">
                <i-input v-model="formTop.username" disabled placeholder="Enter something..."/>
              </FormItem>
              <FormItem label="昵称">
                <i-input v-model="formTop.nickname"/>
              </FormItem>
              <FormItem label="team 组">
                <Select
                  style="width: 200px;"
                  v-model="formTop.group">
                  <Option v-for="item in groupList" :value="+item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Form>
          </Col>
          <Col :xs="{ span: 5, offset: 2 }">
            <div class="avator">
              <p>头像</p>
              <div class="upload-list">
                <Avatar
                  :src="formTop.avatar"
                  v-show="!uploading"
                  :icon="!formTop.avatar ? 'ios-contact' : ''"
                  size="large"/>
                <i-circle :percent="percent" class="progress" :stroke-color="color" v-show="uploading">
                  <Icon v-if="percent == 100" type="ios-checkmark" size="60" style="color:#5cb85c"/>
                  <span v-else style="font-size:24px">{{ percent }}%</span>
                </i-circle>
                <div class="upload-list-cover" v-if="formTop.avatar">
                  <Icon type="ios-eye-outline" @click.native="visible = true"/>
                </div>
              </div>
            </div>
            <Button icon="md-cloud-upload" style="margin-left: 20px; margin-top: 10px;" @click="upload">
              <input type="file" style="display: none">
              <span>更换头像</span>
            </Button>
          </Col>
        </Row>
        <Button size="large" type="primary" @click="updataHandler" :loading="btnLoading">更新基本信息</Button>
      </Content>
    </Layout>
    <Modal title="头像预览" v-model="visible" width="650px">
      <img :src="formTop.avatar" style="width: 100%">
      <div slot="footer"/>
    </Modal>
  </div>
</template>

<script>
  import {mapMutations, mapActions} from 'vuex'
  import {getGroup} from '@/api'
  import {getCurrentUser, updateUserInfo} from './api'

  export default {
    data() {
      return {
        formTop: {
          nickname: '',
          username: '',
          group: '',
          avatar: ''
        },
        uploading: false,
        percent: 0,
        groupList: [],
        btnLoading: false,
        visible: false
      }
    },
    computed: {
      color() {
        let color = '#2db7f5';
        if (this.percent == 100) {
          color = '#5cb85c';
        }
        return color;
      }
    },
    mounted() {
      getCurrentUser().then(({data}) => {
        this.formTop = data
        this.formTop.avatar = data.avatar
      })
      getGroup().then(({data}) => {
        this.groupList = data
      })
    },
    methods: {
      ...mapMutations(['resetUserInfo']),
      ...mapActions(['getMenuList']),
      upload() {
        const me = this
        const options = {
          onStart(res) {
            me.uploading = true
          },
          onProgress(file) {
            me.percent = file.percentComplete
          },
          onSuccess(res) {
            if (res.files && res.files[0] && res.files[0].link) {
              const imgLink = res.files[0].link

              const img = new Image()
              img.onload = () => {
                me.uploading = false
                me.$nextTick(() => [
                  me.percent = 0
                ])
              }
              img.src = imgLink
              me.formTop.avatar = imgLink
            } else {
              me.$Message.error('上传失败')
              me.uploading = false
            }
          },
          onError(res) {
            me.$Message.error('上传失败')
            me.uploading = false
          }
        }
        // ajaxUp(options)
      },
      updataHandler() {
        this.btnLoading = true;
        const showMsg = (params) => {
          this.$Notice[params[0]]({
            title: params[1],
            desc: params[2],
          });
        }
        updateUserInfo(this.formTop).then(() => {
          this.resetUserInfo({avatar: this.formTop.avatar, group: this.formTop.group, nickname: this.formTop.nickname})
          showMsg(['success', '成功', '个人信息更新成功'])
          this.getMenuList()
          this.btnLoading = false
        }, () => {
          showMsg(['error', '失败', '个人信息更新失败'])
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./index";
</style>
