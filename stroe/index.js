import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		nickname: "未设置",
		loginApi: 'http://192.168.2.158:8099/supplychain/api/operator/login', //登录
		operatorSelect:'http://192.168.2.158:8099/supplychain/api/operator/select',//个人信息分页查询
		dispatchlist: 'http://192.168.2.158:8099/supplychain/api/dispatch/list', //我的派单信息分页查询
		dispatchDetailsbyID: 'http://192.168.2.158:8099/supplychain/api/dispatch/select', //根据UUID查询派工单详情
		factoryqueryPage: 'http://192.168.2.158:8099/supplychain/api/factory/select', //查询当前用户所有工厂信息
		saveProducelog: 'http://192.168.2.158:8099/supplychain/api/producelog/save', //保存生产日志
		saveState: 'http://192.168.2.158:8099/supplychain/api/dispatch/saveState', //根据状态接受拒绝派工单
		producelogQuery:'http://192.168.2.158:8099/supplychain/api/producelog/list',//生产日志明细分页查询
		producelogdetail:'http://192.168.2.158:8099/supplychain/api/producelog/select',//生产日志明细查询
		saveStateProducelog: 'http://192.168.2.158:8099/supplychain/api/producelog/saveState', //根据状态接受拒绝生产日志单
		deliverySendgoods:'http://192.168.2.158:8099/supplychain/api/sendgoods/add',//半成品发货
		sendgoodsList:'http://192.168.2.158:8099/supplychain/api/sendgoods/list',//发货历史查询接口
		sendgoodsSelect:'http://192.168.2.158:8099/supplychain/api/sendgoods/select',//发货明细查询
		saveState:'http://192.168.2.158:8099/supplychain/api/sendgoods/saveState',//发货单审核
		inventorylistData:'http://192.168.2.158:8099/supplychain/api/inventory/list',//库存列表信息
		inventorydetails:'http://192.168.2.158:8099/supplychain/api/inventory/select',//库存详情信息
	}
});
export default store
