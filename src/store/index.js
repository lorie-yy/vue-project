import Vuex from 'vuex';
import Vue from 'vue';
// import login from './modules/login';
import getters from './getters.js';
import state from './state.js';
import actions from './actions.js';
import mutations from './mutations.js';
// import loading from './modules/loading';
import createLogger from 'vuex/dist/logger';

const debug = process.env.NODE_ENV !== 'production';
Vue.use(Vuex);
let store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});

export default store;