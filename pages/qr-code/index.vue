<template>
  <div class="mode-qr">
    <Row type="flex" justify="space-between" align="middle" class="code-row-bg">
      <i-col span="10">
        <i-input
          v-model="value"
          class="qr-input"
          placeholder="Enter something..."/>
        <Button class="qr-button" type="primary" shape="circle" @click="handleSubmit">生成</Button>
      </i-col>
      <i-col span="8">
        <Card style="width: 300px">
          <div style="text-align:center">
            <qrcode-vue
              :value="value"
              size="250"
              level="H"/>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue';

  export default {
    components: {QrcodeVue},
    data() {
      return {
        value: ''
      }
    },
    methods: {
      handleSubmit() {

      }
    }
  }
</script>

<style lang="scss">
  .mode-qr {
    text-align: center;
    .qr-button {
      border-radius: 22px;
      margin: 37px auto 0;
      padding: 10px 80px;
    }
    .qr-input {
      margin: 0 auto;
      input {
        height: 60px;
        border: 1px solid #FAFAFA;
        box-shadow: 2px 4px 6px rgba(204, 204, 204, 0.6);
        background-color: rgb(255, 255, 255);
        font-size: 14px;
        color: #757575;
        line-height: 60px;
        text-indent: 15px;
      }
    }
  }

</style>
