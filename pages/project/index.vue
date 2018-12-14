<template>
  <div class="mod-project">
    <Header class="header">
      <div class="lefter">
        <h1>项目列表</h1>
        <p>段落示意：新建工作项目，项目所属小组成员可见。</p>
      </div>
      <div class="r-img">
        <img src="@/assets/images/project.png" alt="">
      </div>
    </Header>
    <div class="list">
      <Row>
        <i-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 12 }"
          :lg="{ span: 8 }">
          <upload-btn
            style="height: 100%"
            @click="clickHandler">
            新增项目
          </upload-btn>
        </i-col>
        <i-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 12 }"
          :lg="{ span: 8 }"
          :key="index"
          v-for="(item, index) in list">
          <Card :bordered="false">
            <div slot="title" class="card-title">
              <div>
                <Avatar icon="ios-person" src="https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png"/>
                <span style="margin-left: 10px">{{ item.name }}</span>
              </div>
              <div class="qr-code">
                <qrcode-vue
                  :value="item.app_test_url"
                  size="32"
                  level="H"
                  @click.native="qrCodeClick(item.app_test_url, '测试包')"
                  v-if="item.app_test_url"/>
                <qrcode-vue
                  :value="item.app_pro_url"
                  size="32"
                  level="H"
                  @click.native="qrCodeClick(item.app_pro_url, '正式包')"
                  v-if="item.app_pro_url"/>
              </div>
            </div>
            <div class="content">
              <p class="description">{{ item.description || '很懒，暂无描述' }}</p>
              <a :href="item.test_url" target="_blank" v-if="item.test_url">测试地址</a>&nbsp;&nbsp;&nbsp;
              <a :href="item.pro_url" target="_blank" v-if="item.pro_url">线上地址</a>
              <a :href="item.git_url" target="_blank" v-if="item.git_url" style="float: right">git地址</a>
            </div>

            <footer class="card-footer">
              <Row>
                <i-col :xs="{ span: 12 }" class="buttons">
                  <Button type="success" @click="updateShow(item, index)">
                    <pre>   编辑   </pre>
                  </Button>
                </i-col>
                <i-col :xs="{ span: 12 }" class="buttons">
                  <Poptip
                    transfer
                    style="text-align: left;"
                    confirm
                    title="确认删除?"
                    @on-ok="del(item)">
                    <Button type="warning">
                      <pre>   删除   </pre>
                    </Button>
                  </Poptip>
                </i-col>
              </Row>
            </footer>
          </Card>
        </i-col>
      </Row>
    </div>
    <data-control
      v-model="showModel"
      :title="title"
      :form="formData"
      :form-value="formValue"
      @submit="add"
    />
    <Modal
      v-model="qrModal"
      width="440"
      class-name="vertical-center-modal"
      class="qrModal"
      :closable="false">
      <p slot="header" style="text-align:center">
        {{ modalTitle || '' }}
      </p>
      <qrcode-vue
        :value="app_url"
        size="400"
        level="H" />
      <div slot="footer"/>
    </Modal>
  </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue';
  import UploadBtn from '@/components/upload-btn';
  import DataControl from '@/components/data-control';
  import {mapState} from 'vuex';
  import {getProject, addProject, delProject, editProject} from './api';

  const formData = [{
    label: '项目名称',
    key: 'name',
    require: true,
    type: 'text',
  }, {
    label: '测试地址',
    key: 'test_url',
    type: 'text',
  }, {
    label: '正式地址',
    key: 'pro_url',
    type: 'text',
  }, {
    label: 'App测试包地址',
    key: 'app_test_url',
    type: 'text',
  }, {
    label: 'App正式包地址',
    key: 'app_pro_url',
    type: 'text',
  }, {
    label: 'git地址',
    key: 'git_url',
    type: 'text',
  }, {
    label: '项目描述',
    key: 'description',
    type: 'textarea',
  }]
  export default {
    components: {QrcodeVue, UploadBtn, DataControl},
    async asyncData({store}) {
    },
    data() {
      return {
        showModel: false,
        list: [],
        formData,
        title: '新建项目',
        formValue: {},
        switchKey: 'add',
        activeItem: '',
        qrModal: false,
        app_url: '',
        modalTitle: ''
      }
    },
    // fetch 并不会设置组件内的data,主要修改vuex用
    // async fetch ({ store, $axios, params }) {
    //   let { data } = await $axios.get('http://my-api/stars')
    //   // store.commit('setStars', data)
    // },
    computed: {
      ...mapState(['authUser'])
    },
    created() {
      if (process.server) return
    },
    mounted() {
      getProject().then(({data}) => {
        this.list = data
      })
    },
    methods: {
      showMsg(params) {
        this.$Notice[params[0]]({
          title: params[1],
          desc: params[2],
        });
      },
      qrCodeClick(url, modalTitle) {
        this.modalTitle = modalTitle;
        this.app_url = url;
        this.qrModal = true;
      },
      clickHandler() {
        this.switchKey = 'add'
        this.showModel = true
      },
      updateShow(item, index) {
        this.switchKey = 'edit'
        this.activeItem = index;
        this.title = '编辑项目';
        this.formValue = {
          ...item,
          group: item.group.toString()
        }
        this.showModel = true
      },
      add(formData) {
        if (this.switchKey === 'add') {
          addProject(formData).then(res => {
            if (+res.data.group === this.authUser.group) {
              this.list.unshift(res.data)
            }
            this.showModel = false
          })
        } else {
          editProject(formData).then(res => {
            this.showModel = false
            if (+res.data.group === this.authUser.group) {
              this.list[this.activeItem] = res.data
            } else {
              this.list.splice(this.activeItem, 1)
            }
            this.showMsg(['success', '成功', '修改成功'])
          })
        }
      },
      del(data) {
        delProject({id: data.id}).then(() => {
          this.list = this.list.filter(item => data.id !== item.id)
          this.showMsg(['success', '成功', '删除成功'])
        }, () => {
          this.showMsg(['error', '失败', '删除失败'])
        })
      }
    }
  }
</script>

<style lang="scss">
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal {
      top: 0;
    }
  }

  .qrModal {
    .ivu-modal-body {
      text-align: center;
    }
    .ivu-modal-footer {
      display: none;
    }
  }

  .mod-project {
    .card-title {
      height: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .qr-code {
        > div {
          cursor: pointer;
          display: inline-block;
          margin-left: 20px;
        }
        /*margin-left: 30%;*/
      }
    }
    .ivu-card {
      border: 1px solid #e8e8e8;
    }
    .ivu-card-body {
      padding-bottom: 0;
    }
    pre {
      line-height: 0;
    }
  }
</style>
<style scoped lang="scss">
  @import "./index.less";
</style>
