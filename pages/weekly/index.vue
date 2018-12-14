<template>
  <div class="mod-weekly">
    <Layout>
      <Content class="title-card">
        <Row>
          <Col span="8">
          <span class="top-p">我的待办</span>
          <p class="bottom-p">{{ misdMission }}个任务</p>
          </Col>
          <Col span="8">
          <span class="top-p">总任务数</span>
          <p class="bottom-p">{{ allMession }}个任务</p>
          </Col>
          <Col span="8">
          <span class="top-p">本周完成任务</span>
          <p class="bottom-p">{{ doneMission }}个任务</p>
          </Col>
        </Row>
      </Content>
      <Content class="lists">
        <div class="top-header">
          <h2>任务列表</h2>
          <ButtonGroup>
            <Button
              :type="!isAll ? 'primary' : 'default'"
              @click.native="changeList(false)">我的任务
            </Button>
            <Button
              :type="isAll ? 'primary' : 'default'"
              @click.native="changeList(true)">全部任务
            </Button>
          </ButtonGroup>
          <Button
            v-if="list.length"
            size="default"
            icon="ios-download-outline"
            type="primary"
            class="download"
            @click="exportTable">导出
          </Button>
          <p v-else style="width: 100px;">&nbsp;</p>
        </div>
        <upload-btn
          style="height: 32px"
          @click="clickHandler('add')">
          添加
        </upload-btn>
        <ul class="list-content">
          <!--key值作用-->
          <li v-for="(item) in list" :key="item.id" class="list-item">
            <Row type="flex" justify="space-between" align="middle">
              <Col span="10">
              <div class="flex">
                <Avatar
                  size="large"
                  :src="img"/>
                <div class="left-icon">
                  <h3>{{ item.project_name }}</h3>
                  <p>{{ item.description || '没有说明' }}</p>
                </div>
              </div>
              </Col>
              <Col span="11" class="info">
              <div class="text" >
                <p :style="{color: authUser.userId === item.userId ? '#5cadff': 'rgba(0, 0, 0, 0.45)'}">Owner</p>
                <p :style="{color: authUser.userId === item.userId ? '#5cadff': 'rgba(0, 0, 0, 0.45)'}">
                  {{ item.owner || '缺省' }}
                </p>
              </div>
              {{ parseData(item) }}
              <div class="text">
                <p>开发周期</p>
                <p v-if="item.date_range[0]">{{ item.date_range[0] }}&nbsp;&nbsp;{{ item.date_range[1] }}</p>
                <p v-else>未填写</p>
              </div>
              <div class="text">
                <p>联调周期</p>
                <p v-if="item.simulation_range[0]">{{ item.simulation_range[0] }}&nbsp;&nbsp;{{ item.simulation_range[1]
                  }}</p>
                <p v-else>未填写</p>
              </div>
              <Progress :percent="item.percent || 0" :stroke-width="5" status="active"/>
              </Col>
              <Col span="3" class="operation">
              <template v-if="item.userId === authUser.userId">
                <Button type="text" style="color: #1890ff;" @click="clickHandler('edit', item)">编辑</Button>
                <Poptip
                  transfer
                  style="text-align: left;"
                  confirm
                  title="确认删除?"
                  @on-ok="delHandler(item)">
                  <Button type="text" style="color: #1890ff;">删除</Button>
                </Poptip>
              </template>
              </Col>
            </Row>
          </li>
        </ul>
        <!--<Page :total="100"/>-->
      </Content>
    </Layout>
    <data-control
      v-model="showModel"
      :title="title"
      :form="formData"
      :form-value="formValue"
      @submit="todo"/>
    <Table ref="table" style="display: none"/>
  </div>
</template>

<script>
  import DataControl from '@/components/data-control';
  import UploadBtn from '@/components/upload-btn';
  import img from './images/1.png';
  import moment from 'moment'
  import _ from 'lodash'
  import { mapState } from 'vuex';
  import {exportData} from './exportData';

  import {getProject, getWeekly, delWeekly, editWeekly, addWeekly} from './api';

  const formData = [{
    width: '250px',
    label: '项目名称',
    key: 'project_id',
    require: true,
    children: [],
    type: 'select',
    render: () => {
      return getProject()
    }
  }, {
    label: '需求名称',
    key: 'order',
    require: true,
    type: 'text',
  }, {
    label: '需求jira',
    key: 'wiki_url',
    require: true,
    type: 'text',
  }, {
    label: '开发周期',
    key: 'date_range',
    type: 'datetimerange',
  }, {
    label: '联调周期',
    key: 'simulation_range',
    type: 'datetimerange',
  }, {
    label: 'FE',
    group: '1',
    width: '250px',
    key: 'fe_name',
    children: [],
    type: 'autoComplete',
  }, {
    width: '250px',
    label: 'RD',
    key: 'rd_name',
    children: [],
    group: '2',
    type: 'autoComplete',
  }, {
    width: '250px',
    label: 'PM',
    group: '3',
    key: 'pm_name',
    children: [],
    type: 'autoComplete',
  }, {
    width: '250px',
    label: 'QA',
    group: '4',
    key: 'qa_name',
    children: [],
    type: 'autoComplete',
  }, {
    label: '其他说明',
    placeholder: '项目是否延期，原因，需求改动，等等',
    key: 'description',
    type: 'textarea',
  }]
  export default {
    components: {UploadBtn, DataControl},
    data() {
      return {
        img,
        allMession: 0,
        doneMission: 0,
        misdMission: 0,
        list: [],
        showModel: false,
        title: '任务编辑',
        switch: '', //编辑or删除
        formValue: {},
        formData: [],
        pageParams: {
          userId: undefined
        },
        isAll: false,
        ownerKey: ''
      }
    },
    computed: {
      ...mapState(['authUser']),
    },
    mounted() {
      this.formData = formData.filter(item => {
        if( +item.group !== this.$store.state.authUser.group) return true;
        else {
          this.ownerKey = item.key
          return false;
        }

      })
      this.getData()
    },
    methods: {
      changeList(type) {
        this.isAll = type;
        if (type) {
          this.getData();
        } else {
          this.filerMyMiss(this.list);
        }
      },
      filerMyMiss(list) {
        this.list = list.filter(item => item.userId === this.authUser.userId);
        this.$nextTick(() => {
          this.misdMission = this.list.length - this.doneMission
        })
      },
      getData() {
        getWeekly(this.pageParams).then(res => {
          this.allMession = res.data.length
          if (this.isAll) {
            this.list = res.data;
          } else {
            this.doneMission = 0;
            this.filerMyMiss(res.data);
          }
        })
      },
      parseData(item) {
        if (process.client) {
          if (typeof item.date_range === 'string') {
            item.date_range = JSON.parse(item.date_range);
            item.simulation_range = JSON.parse(item.simulation_range);
            var a = moment(item.date_range[0]).unix();
            var b = moment(item.date_range[1]).unix();
            var c = moment(item.simulation_range[0]).unix();
            var d = moment(item.simulation_range[1]).unix();
            if (a > c) return;
            var start = a;
            var end = b < d ? d : b;
            var now = moment().unix();
            if (now > start && now < end) {
              var mini = (now - start) / (end - start);
              var percent = mini.toFixed(2) * 100;
              item.percent = percent > 0 ? Math.floor(percent) : 0;
            } else if (now >= end) {
              if (!this.isAll)
                this.doneMission++;
              item.percent = 100;
            } else {
              item.percent = 0;
            }
          }
        }
      },

      showMsg(params) {
        this.$Notice[params[0]]({
          title: params[1],
          desc: params[2],
        });
      },
      clickHandler(type, item) {
        this.switch = type
        if (type === 'edit') {
          this.formValue = {
            ...item,
            project_id: item.project_id.toString()
          }
        }
        this.showModel = true
      },
      delHandler(data) {
        delWeekly({id: data.id}).then(res => {
          this.showMsg(['success', '成功', '删除成功']);
          this.list = this.list.filter(item => item.id !== data.id)
          this.showModel = false;
        })
      },
      todo(data) {
        const [start, end] = data.date_range;
        const [s_start, s_end] = data.simulation_range;
        data.date_range = data.date_range.map(item => {
          return item ? moment(item).format('YYYY-MM-DD') : ''
        });
        data.simulation_range = data.simulation_range.map(item => {
          return item ? moment(item).format('YYYY-MM-DD') : ''
        })
        if (this.switch === 'add') {
          addWeekly(data).then(() => {
            this.showMsg(['success', '成功', '添加成功']);
            this.getData()
            this.showModel = false;
          }, (err) => {
            this.showMsg(['error', '失败', err.errors[0].message]);
          })
        } else {
          editWeekly(data).then(() => {
            this.showMsg(['success', '成功', '修改成功']);
            this.getData()
            this.showModel = false;
          }, (err) => {
            this.showMsg(['error', '失败', err.errors[0].message]);
          })
        }
      },
      exportTable() {
        const colums = [{
          "title": "Weak",
          "key": "weak",
          "width": 150,
          "sortable": true
        }, {
          "title": "Signin",
          "key": "signin",
          "width": 150,
          "sortable": true
        }];
//        this.$refs.table.exportCsv({
//          filename: '周报',
//          columns: colums,
//          data: data
//        });

        exportData(_.cloneDeep(formData),  _.cloneDeep(this.list), this.ownerKey, this.$refs.table.exportCsv)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./index.scss";
</style>
