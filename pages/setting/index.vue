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
              <i-circle :percent="percent" class="progress" :stroke-color="color" v-if="progress">
                <Icon v-if="percent == 100" type="ios-checkmark" size="60" style="color:#5cb85c"/>
                <span v-else style="font-size:24px">{{ percent }}%</span>
              </i-circle>
              <Avatar
                :src="formTop.avatar"
                v-else
                :icon="!formTop.avatar ? 'ios-contact' : ''"
                size="large"/>
              <div class="upload-list-cover" v-if="formTop.avatar">
                <Icon type="ios-eye-outline" @click.native="visible = true"/>
              </div>
            </div>
          </div>
          <Upload
            style="display: none"
            ref="upload"
            name="image"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :on-success="handleSuccess"
            :on-error="handleRrror"
            :on-progress="handleProgress"
            :before-upload="handleBeforeUpload"
            :multiple="false"
            type="select"
            action="/api/uploadImg">
            <Button icon="md-cloud-upload" style="margin-left: 20px; margin-top: 10px;">
              <span>更换头像</span>
            </Button>
          </Upload>
            <Button icon="md-cloud-upload" style="margin-left: 20px; margin-top: 10px;" @click = "uploadHandler">
              <span>更换头像</span>
            </Button>
          </Col>
        </Row>
        <Button size="large" type="primary" @click="updataHandler" :loading="btnLoading">更新基本信息</Button>
      </Content>
    </Layout>
    <Modal title="上传头像" v-model="visibleCropper" width="850px" class="image-cropper">
      <Cropper @on-crop="handleCroped" />
      <div slot="footer"/>
    </Modal>
    <!--<Modal title="头像预览" v-model="visible" width="650px">-->
      <!--<img :src="formTop.avatar" style="width: 100%">-->
      <!--<div slot="footer"/>-->
    <!--</Modal>-->
  </div>
</template>

<script>
  import {mapMutations, mapActions} from 'vuex'
  import {getGroup} from '@/api'
  import Cropper from '@/components/cropper'
  import {getCurrentUser, updateUserInfo} from './api'

  export default {
    components: {Cropper},
    data() {
      return {
        formTop: {
          nickname: '',
          username: '',
          group: '',
          avatar: ''
        },
        percent: 0,
        groupList: [],
        btnLoading: false,
        progress: false,
        visible: false,
        visibleCropper: false,
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
      this.uploadList = this.$refs.upload.fileList;
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
      uploadHandler() {
        this.visibleCropper = true
      },
      handleCroped (blob) {
        console.log(URL.createObjectURL(blob))
        this.formTop.avatar = URL.createObjectURL(blob)
        // const formData = new FormData()
        // formData.append('image', blob)
        // uploadImg(formData).then(() => {
        //   this.$Message.success('Upload success~')
        // })
      },
      handleSuccess(res, file) {
        const { url } = res.data;
        this.formTop.avatar = url;
        var img = new Image()
        img.onload = () => {
          this.progress = false;
          this.percent = 0;
        }
        img.src = url;
      },
      handleFormatError(file) {
        this.progress = false;
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize(file) {
        this.progress = false;
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      handleBeforeUpload () {
        this.progress = true;
        return true;
      },
      handleProgress(event) {
        this.percent = Math.floor(event.percent)
      },
      handleRrror(error) {
        this.progress = false;
        console.log(error)
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

<style lang="scss">
  /*.image-cropper {*/
    /*.cropper-wrapper {*/
    /*}*/
  /*}*/
</style>
<style scoped lang="scss">
  @import "./index";
</style>
