<template>
  <ul>
    <template v-for="(item, index) in packages[mem.userId]">
      <li class="recieve-msg flex" v-if="item.type === 'recieve'" :key="item.dateTime">

        <template v-if="item.avatar">
          <Avatar shape="square" :src="item.avatar" size="large"/>
        </template>
        <template v-else>
          <Avatar style="background: #00a2ae" shape="square" icon="ios-person" size="large"/>
        </template>
        <div class="right-area">
          <h3>{{ item.nickname || item.username }}</h3>
          <pre class="word">{{ item.message }}</pre>
        </div>
      </li>

      <li class="post-msg flex" v-else :key="index">
        <div class="left-area">
          <pre class="word">{{ item.message }}</pre>
        </div>
        <template v-if="item.avatar">
          <Avatar shape="square" :src="item.avatar" size="large"/>
        </template>
        <template v-else>
          <Avatar style="background: #00a2ae" shape="square" icon="ios-person" size="large"/>
        </template>
      </li>
    </template>
  </ul>
</template>

<script>
  export default {
    components: {},
    props: {
      packages: {
        type: Object
      },
      mem: {
        type: Object
      }
    },
    computed: {

    },
    methods: {
    }
  }
</script>

<style scoped lang="scss">
  .flex {
    display: flex;
    justify-content: flex-start;
  }
  .word {
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dde2ea;
    padding: 8px;
  }
  .right-area {
    margin-left: 10px;
  }
  .left-area {
    margin-right: 10px;
  }
  .recieve-msg {
    margin: 10px 0 0 20px;
  }
  .post-msg {
    justify-content: flex-end;
    margin: 10px 20px 0 0px;
    .word {
      background-color: #98E165;
    }
  }
</style>
