<template>
  <Modal
    v-model="modal"
    :mask-closable="false"
    @on-cancel="handleReset"
    :title="title">
    <Form ref="formValidate" :model="formParams" :rules="ruleValidate" :label-width="100">
      <FormItem :label="item.label" :prop="item.key" v-for="(item, index) in form" :key="index">
        <Input v-model="formParams[item.key]"
               :key="item.key"
               :placeholder="'请输入' + item.label"
               :style="{width: item.width}"
               v-if="!item.type || item.type === 'text'"></Input>
        <Select v-model="formParams[item.key]"
                filterable
                :key="item.key"
                :style="{width: item.width}"
                :placeholder="'Select your ' + item.label"
                :loading="item.loading"
                v-else-if="item.type === 'select'">
          <Option :value="node.id.toString()" v-for="node in item.children" :key="node.id">{{ node.name }}</Option>
        </Select>
        <Input v-else-if="item.type === 'textarea'"
               v-model="formParams[item.key]"
               :key="item.key"
               type="textarea" :autosize="{minRows: 2,maxRows: 5}"
               :placeholder="item.placeholder || 'Enter something...'"></Input>

        <AutoComplete
          v-else-if="item.type === 'autoComplete'"
          v-model="formParams[item.key]"
          @on-focus="handleFocus(item)"
          @on-search="handleSearch(item)"
          placeholder="input here"
          style="width:200px">
          <Option v-for="option in item.children || []" :value="option.name" :key="option.id">
            {{ option.name }}
          </Option>
        </AutoComplete>

        <DatePicker
          v-else-if="item.type === 'datetimerange'"
          v-model="formParams[item.key]"
          split-panels
          type="daterange"
          show-week-numbers
          placement="bottom-end"
          placeholder="Select date"
          @on-change="(data) => {onChange(data, item.key)}"
          style="width: 200px"/>

      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="success" size="large" long :loading="modal_loading" @click="handleSubmit('formValidate')">保存
      </Button>
    </div>
  </Modal>
</template>
<script>
  import ruleValidate from './rules'
  import {getMembers} from '@/api'

  export default {
    model: {
      event: 'show'
    },
    props: {
      value: {
        type: Boolean
      },
      title: {
        type: String
      },
      form: {
        type: Array,
        default: () => []
      },
      formValue: {
        type: Object
      }
    },
    data() {
      return {
        modal: false,
        modal_loading: false,
        formParams: {},
      }
    },
    computed: {
      ruleValidate() {
        const obj = {}
        this.form.forEach((item) => {
          if (!item.require) {
            return
          } else {
            obj[item.key] = ruleValidate[item.type]
          }
        })
        return obj
      }
    },
    watch: {
      value(nV) {
        this.$refs['formValidate'].resetFields();
        this.modal = nV
      },
      formValue(nV) {
        this.formParams = nV
      },
      form(nV, oV) {
        if(!oV.length) {
          nV.forEach((item, index) => {
            if (item.render) {
              // // if(oV[index].render !== item.render)
              // console.log((oV));
              item.loading = true
              item.render().then(({data}) => {
                item.children = data || []
                item.loading = false
              })
            }
          });
        }
      }
    },
    mounted() {
      this.form.forEach(item => {
        if (item.render) {
          item.loading = true
          item.render().then(({data}) => {
            item.children = data || []
            item.loading = false
          })
        }
      })
    },
    methods: {
      onChange(data, key) {
        this.formParams[key] = data;
      },
      handleFocus(item) {
        if(item.children.length) return;
        getMembers({role: item.key.split('_')[0]}).then(res => {
          item.children = res.data
        })
      },
      handleSearch(item) {
        // getMembers({role: item.key.split('_')[0]}).then(res => {
        //   item.children = res.data
        // })
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$emit('submit', this.formParams)
          } else {
          }
        })
      },
      handleReset(name) {
        this.$refs[name || 'formValidate'].resetFields();
        this.$emit('show')
      }
    }
  }
</script>
