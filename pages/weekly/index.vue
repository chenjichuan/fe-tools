<template>
  <div class="mod-weekly">
    <Layout>
      <Content class="title-card">
        <Row>
          <i-col span="8">
            <span class="top-p">我的待办</span>
            <p class="bottom-p">{{ misdMission }}个任务</p>
          </i-col>
          <i-col span="8">
            <span class="top-p">总任务数</span>
            <p class="bottom-p">{{ allMession }}个任务</p>
          </i-col>
          <i-col span="8">
            <span class="top-p">本周完成任务</span>
            <p class="bottom-p">{{ doneMission }}个任务</p>
          </i-col>
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
              <i-col span="10">
                <div class="flex">
                  <div style="text-align: center">
                    <Avatar
                      size="large"
                      :src="img"/>
                    <div style="text-align: center;">
                      <a
                        :href="item.wiki_url"
                        target="_blank"
                        v-if="item.wiki_url">
                        <p>Jira</p>
                        <p>CTOB-{{ item.wiki_url.split('CTOB-').reverse()[0] }}</p>
                      </a>
                    </div>
                  </div>
                  <div class="left-icon">
                    <h3>{{ item.project_name }}</h3>
                    <p>{{ item.order || '尚未填写' }}</p>
                  </div>
                </div>
              </i-col>
              <i-col span="11" class="info">
                {{ parseData(item) }}
                <div class="text">
                  <p :style="{color: authUser.userId === item.userId ? '#5cadff': 'rgba(0, 0, 0, 0.45)'}">Owner</p>
                  <p :style="{color: authUser.userId === item.userId ? '#5cadff': 'rgba(0, 0, 0, 0.45)'}">
                    {{ item.owner || '缺省' }}
                  </p>
                </div>
                <div style="display: inline-block">
                  <div class="text">
                    <p>开发周期</p>
                    <p v-if="item.date_range[0]">{{ item.date_range[0] }}&nbsp;&nbsp;{{ item.date_range[1] }}</p>
                    <p v-else>未填写</p>
                  </div>
                  <div class="text" style="position: relative">
                    <p>联调周期</p>
                    <a
                      v-show="false"
                      style="position: absolute;right: 0;top: 0;"
                      :href="item.wiki_url"
                      target="_blank"
                      v-if="item.wiki_url">Jira</a>
                    <p v-if="item.simulation_range[0]">{{ item.simulation_range[0] }}&nbsp;&nbsp;{{
                      item.simulation_range[1]
                      }}</p>
                    <p v-else>未填写</p>
                  </div>
                  <div class="text">
                    <p style="">上线日期</p>
                    <p v-if="item.product_time">{{ item.product_time }}</p>
                    <p v-else>未填写</p>
                  </div>
                </div>
                <Progress :percent="item.percent || 0" :stroke-width="5" status="active"/>
              </i-col>
              <i-col span="3" class="operation">
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
              </i-col>
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
  import {mapState} from 'vuex';
  import {exportData} from './exportData';

  import {getWeekly, delWeekly, editWeekly, addWeekly} from './api';

  import formData from './tableData'

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
        if (+item.group !== this.$store.state.authUser.group) return true;
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
        } else {
          for (let k of Object.keys(this.formValue)) {
            this.$delete(this.formValue, k);
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
        data.date_range = data.date_range.map(item => {
          return item ? moment(item).format('YYYY-MM-DD') : ''
        });
        data.simulation_range = data.simulation_range.map(item => {
          return item ? moment(item).format('YYYY-MM-DD') : ''
        })
        data.product_time = data.product_time ?  moment(data.product_time).format('YYYY-MM-DD') : ''
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

        exportData(_.cloneDeep(formData), _.cloneDeep(this.list), this.ownerKey, this.$refs.table.exportCsv)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./index.scss";

  .mod-weekly {
    width: 100%;
  }
</style>
