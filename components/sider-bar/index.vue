<template>
  <div>
    <Menu
      ref="menu"
      v-show="!isCollapsed"
      width="auto"
      :active-name="activeName"
      :theme="theme"
      :open-names="openNames"
      :class="menuitemClasses">
      <template
        v-for="(item, index) in menuList"
        v-if="!item.hide">
        <Submenu :name="item.name" v-if="item.children" :key="index">
          <template slot="title">
            <Icon :type="item.icon"/>
            <span>{{ item.valueText }}</span>
          </template>
          <MenuItem
            v-for="(sub, key) in item.children"
            :key="key"
            @click.native="$router.push(sub.path)"
            :name="sub.name">
            <common-icon :type="sub.icon || ''"/>
            <span>{{ sub.valueText }}</span>
          </MenuItem>
        </Submenu>
        <MenuItem
          v-else
          :key="index"
          :name="item.name"
          @click.native="$router.push(item.path)">
          <common-icon :type="item.icon || ''"/>
          <span>{{ item.valueText }}</span>
        </MenuItem>
      </template>
    </Menu>
    <Menu
      id="main-menu"
      v-show="isCollapsed"
      width="auto"
      :active-name="$route.name"
      :theme="theme"
      :class="menuitemClasses">
      <template
        v-for="(item, index) in menuList">
        <Tooltip
          v-if="!item.children || !item.children.length"
          :key="index"
          v-show="!item.hide"
          :content="item.valueText"
          placement="right"
          class="toplip">
          <MenuItem
            :name="item.name"
            @click.native="go(item)">
            <common-icon :type="item.icon || ''" class="menu-icon"/>
            <span>{{ item.valueText }}</span>
          </MenuItem>
        </Tooltip>
        <Dropdown v-else placement="right-start" style="width: 100%;">
            <MenuItem
              :name="item.name"
              @click.native="go(item)">
              <common-icon :type="item.icon || ''" class="menu-icon"/>
              <span>{{ item.valueText }}</span>
            </MenuItem>
            <DropdownMenu slot="list">
              <DropdownItem
                v-for="(child) in item.children"
                :key="child.name"
                @click.native="$router.push(child.path)">{{ child.valueText }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
      </template>


    </Menu>
  </div>
</template>

<script>
  import CommonIcon from '@/components/common-icon'

  export default {
    components: {CommonIcon},
    props: {
      isCollapsed: {
        type: Boolean,
        default: false
      },
      menuList: {
        type: Array,
        default: () => []
      },
      menuitemClasses: {
        type: Array,
        default: () => []
      },
      theme: {
        type: String
      }
    },
    data() {
      return {
        activeName: '',
        openNames: [],
      }
    },
    computed: {
    },
    watch: {
      '$route'() {
        this.refreshMenuActive()
      },
      menuList() {
        this.$nextTick(() => {
          this.refreshMenuActive()
        })
      }
    },
    mounted() {

    },
    methods: {
      refreshMenuActive() {
        this.activeName = this.$route.name;
        this.menuList.forEach(item => {
          if(item.children) {
            const [res] = item.children.filter(node => node.name  === this.activeName)
            if (res) {
              this.openNames = [item.name]
              this.$nextTick(() => {
                this.$refs.menu.updateOpened();
                this.$refs.menu.updateActiveName();
              })
            }
          }
        })
      },
      go(item) {
        if (item.path) {
          this.$router.push(item.path)
        }
      },
      onMenuclick(item) {
        console.log(item)
      }
    }
  }
</script>
<style>
  #main-menu .ivu-select-dropdown {
    width: auto;
  }
</style>
<style scoped lang="scss">
  .menu-item{
    .toplip {
      width: 100%;
      height: 100%;
    }
  }

</style>
