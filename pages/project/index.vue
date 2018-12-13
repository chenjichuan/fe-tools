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
            style="height: 188px"
            @click="clickHandler">
            新增项目
          </upload-btn>
        </i-col>
        <i-col
          style="height: 188px"
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 12 }"
          :lg="{ span: 8 }"
          :key="index"
          v-for="(item, index) in list">
          <Card :bordered="false">
            <p slot="title" class="card-title">
              <Avatar icon="ios-person" src="https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png"/>
              <span style="margin-left: 10px">{{ item.name }}</span>
            </p>
            <p class="description">{{ item.description || '很懒，暂无描述' }}</p>
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
  </div>
</template>

<script>
  import UploadBtn from '@/components/upload-btn';
  import DataControl from '@/components/data-control';
//  import  { getGroup } from '@/api';
  import { mapState } from 'vuex';
  import { getProject, addProject, delProject, editProject } from './api';

  export default {
    components: {UploadBtn, DataControl},
    async asyncData({store}) {},
    data() {
      return {
        showModel: false,
        list: [],
        formData: [ {
          label: '项目名称',
          key: 'name',
          require: true,
          type: 'text',
        }, {
          label: '项目描述',
          key: 'description',
          type: 'textarea',
        }],
        title: '新建项目',
        formValue: {},
        switchKey: 'add',
        activeItem: ''
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
      showMsg(params)  {
        this.$Notice[params[0]]({
          title: params[1],
          desc: params[2],
        });
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
  .mod-project {
    .card-title {
      line-height: 30px;
      height: auto;
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
