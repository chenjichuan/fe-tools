import Storage from 'vue-ls';
import Vue from 'vue';

const options = {
  namespace: 'fe_tools__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
};

Vue.use(Storage, options);
