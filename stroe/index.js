import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
 state : {
  nickname : "未设置"
 }
});
export default store