import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
 state : {
  nickname : "未设置",
  loginApi:'http://192.168.2.241:8099/supplychain/api/operator/login',//登录
  dispatchlist:'http://192.168.2.241:8099/supplychain/api/dispatch/list',//我的派单信息分页查询
  dispatchDetailsbyID:'http://192.168.2.241:8099/supplychain/api/dispatch/select'//根据UUID查询派工单详情
 
 }
});
export default store