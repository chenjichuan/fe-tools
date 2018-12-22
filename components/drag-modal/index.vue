<template>
  <div>
    <Modal
      v-model="show"
      draggable
      scrollable
      :closable="false"
      title="Modal">
      <div>This is the first modal</div>
      <div slot="footer">
        <Button @click="closeHandler">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    modal: {
      event: 'hide'
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: false
      }
    },
    watch: {
      value(nV) {
        this.show = nV;
      }
    },
    methods: {
      closeHandler() {
        this.$emit('hide');
        this.$emit('close');
      },
    }
  }
</script>

<style scoped>

</style>
