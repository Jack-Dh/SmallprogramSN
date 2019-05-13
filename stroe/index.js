import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		nickname: "未设置",
		loginApi: 'http://192.168.2.241:8099/supplychain/api/operator/login', //登录
		dispatchlist: 'http://192.168.2.241:8099/supplychain/api/dispatch/list', //我的派单信息分页查询
		dispatchDetailsbyID: 'http://192.168.2.241:8099/supplychain/api/dispatch/select', //根据UUID查询派工单详情
		factoryqueryPage: 'http://192.168.2.241:8099/supplychain/api/factory/select', //查询当前用户所有工厂信息
		saveProducelog: 'http://192.168.2.241:8099/supplychain/api/producelog/save', //保存生产日志
		saveState: 'http://192.168.2.241:8099/supplychain/api/dispatch/saveState', //根据状态接受拒绝派工单
		producelogQuery:'http://192.168.2.241:8099/supplychain/api/producelog/list',//生产日志明细分页查询
		producelogdetail:'http://192.168.2.241:8099/supplychain/api/producelog/select'//生产日志明细查询
	}
});
export default store
