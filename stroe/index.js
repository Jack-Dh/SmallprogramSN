import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		nickname: "未设置",
		loginApi: 'https://supply.jiajiachuang.cn/supplychain/api/operator/login', //登录
		operatorSelect:'https://supply.jiajiachuang.cn/supplychain/api/operator/select',//个人信息分页查询
		dispatchlist: 'https://supply.jiajiachuang.cn/supplychain/api/dispatch/list', //我的派单信息分页查询
		dispatchDetailsbyID: 'https://supply.jiajiachuang.cn/supplychain/api/dispatch/select', //根据UUID查询派工单详情
		factoryqueryPage: 'https://supply.jiajiachuang.cn/supplychain/api/factory/select', //查询当前用户所有工厂信息
		saveProducelog: 'https://supply.jiajiachuang.cn/supplychain/api/producelog/save', //保存生产日志
		saveStates: 'https://supply.jiajiachuang.cn/supplychain/api/dispatch/saveState', //根据状态接受拒绝派工单
		producelogQuery:'https://supply.jiajiachuang.cn/supplychain/api/producelog/list',//生产日志明细分页查询
		producelogdetail:'https://supply.jiajiachuang.cn/supplychain/api/producelog/select',//生产日志明细查询
		saveStateProducelog: 'https://supply.jiajiachuang.cn/supplychain/api/producelog/saveState', //根据状态接受拒绝生产日志单
		deliverySendgoods:'https://supply.jiajiachuang.cn/supplychain/api/sendgoods/add',//半成品发货
		sendgoodsList:'https://supply.jiajiachuang.cn/supplychain/api/sendgoods/list',//发货历史查询接口
		sendgoodsSelect:'https://supply.jiajiachuang.cn/supplychain/api/sendgoods/select',//发货明细查询
		saveState:'https://supply.jiajiachuang.cn/supplychain/api/sendgoods/saveState',//发货单审核
		inventorylistData:'https://supply.jiajiachuang.cn/supplychain/api/inventory/list',//库存列表信息
		inventorydetails:'https://supply.jiajiachuang.cn/supplychain/api/inventory/select',//库存详情信息
	}
});
export default store
