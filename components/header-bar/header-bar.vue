<template>
  <div class="header-bar">
    <Icon @click.native="collapsedSider"
          :class="rotateIcon"
          :style="{margin: '0 20px'}" type="md-menu"
          size="24"/>
    <custom-bread-crumb show-icon style="margin-left: 20px;" :list="breadCrumbList" />
    <div class="custom-content-con">
      <slot/>
    </div>
  </div>
</template>
<script>
  import customBreadCrumb from './custom-bread-crumb'
  import './header-bar.less'

  export default {
    components: {
      customBreadCrumb
    },
    props: {
      isCollapsed: {
        type: Boolean
      }
    },
    computed: {
      rotateIcon() {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ]
      },
      breadCrumbList () {
        return this.$store.state.app.breadCrumbList
      }
    },
    methods: {
      collapsedSider() {
        this.$emit('doCollapsed')
      }
    }
  }
</script>
