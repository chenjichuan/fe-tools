<template>
  <div class="mode-qr">
    <Card style="width:50%; margin: 0 auto;">
      <div style="text-align:center">
        <qrcode-vue
          :value="value"
          size="400"
          level="H" />
      </div>
    </Card>

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
    }
  }
</script>

<style scoped lang="scss">
  .mode-qr {
    text-align: center;
  }

</style>
