<template>
  <div class="layout main" id="default-layout">
    <Layout style="height: 100%;display: flex;">
      <Sider ref="side1" collapsible collapsed-width="80"
             width="200px"
             style="height: 100%;"
             :style="{'overflow': isCollapsed ? '': 'hidden'}"
             class="ivu-menu-dark"
             v-model="isCollapsed">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
            <img :src="maxLogo" v-show="!isCollapsed">
            <img :src="minLogo" v-show="isCollapsed" class="min-logo" >
        </div>
        <sider-bar
          :style="{'min-width': isCollapsed ? 'auto': '200px'}"
          :theme="theme"
          :menuitem-classes="menuitemClasses"
          :menu-list="app.menuList"
          :is-collapsed="isCollapsed"/>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar header-con">
          <header-bar :is-collapsed="isCollapsed" @doCollapsed="isCollapsed = !isCollapsed">
            <user :user-avator="userAvator"/>
          </header-bar>
        </Header>
        <Content class="main-content">
          <nuxt/>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  import Vue from 'vue'
  import minLogo from '@/assets/images/logo-min.jpg'
  import maxLogo from '@/assets/images/logo.png'
  import HeaderBar from '@/components/header-bar'
  import User from '@/components/header-bar/user'
  import SiderBar from '@/components/sider-bar'
  import {mapState, mapMutations, mapActions} from 'vuex'
  import websockets from'../plugins/socket.io'
  export default {
    middleware: 'authenticated',
    components: {HeaderBar, User, SiderBar},
    head () {
      return {
        title: this.title
      }
    },
    data() {
      return {
        isCollapsed: true,
        minLogo,
        maxLogo,
        switchThem: false,
        isFullscreen: false,
      }
    },
    computed: {
      ...mapState(['app', 'authUser']),
      theme() {
        return 'dark'
      },
      menuitemClasses() {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },
      userAvator() {
        const {avatar = ''} = this.authUser
        return avatar
      },
      title() {
        const breadCrumbList = this.app.breadCrumbList
        const current = breadCrumbList[breadCrumbList.length - 1];
        if(current) {
          return current.title || current.valueText
        } else {
          return 'fe-tools'
        }
      }
    },
    watch: {
      '$route'(newRoute) {
        this.setBreadCrumb(newRoute)
      },
      isCollapsed(nV) {
        Vue.ls.set('isCollapsed', nV);
      }
    },
    created() {
      // layout 全部函数只渲染1次，asyncData 不执行
      if (process.client) {
        websockets()
      }
    },
    async mounted() {
      /**
       * @description 初始化设置面包屑导航和标签导航
       */
      await this.getMenuList()
      this.setHomeRoute(this.app.menuList)
      this.setBreadCrumb(this.$route)
      this.isCollapsed = Vue.ls.get('isCollapsed', true)
    },

    methods: {
      ...mapMutations([
        'setBreadCrumb',
        'setHomeRoute',
      ]),
      ...mapActions(['getMenuList']),
      collapsedSider() {
        this.$refs.side1.toggleCollapse();
      },
    }
  }
</script>
<style lang="less">
  @import "./default";
</style>
<style lang="less" scoped>
  .main-content {
    position: relative;
    min-height: 260px;
    padding: 24px;
    display: flex;
    flex-shrink: 0;
  }
</style>
