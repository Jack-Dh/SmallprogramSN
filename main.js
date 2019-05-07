import Vue from 'vue'
import App from './App'
import http from './common/http/index.js'


/**
 * 
 * Vuex全局变量
 */
import store from './stroe/index.js'

Vue.prototype.$store = store;
Vue.prototype.$http = http






/****
请求拦截器
*/
http.interceptor.request = (config) => {
	//添加通用参数
	uni.showLoading({
		title: '加载中'
	});

	/***
	判断请求参数不为空时，添加请求头信息
	*/
	let tokens = uni.getStorageSync('wx_token')
	let sessionID = uni.getStorageSync('wx_sessionID')
	let userUUID = uni.getStorageSync('wx_uuid')

	if (tokens || sessionID || userUUID) {
		config.header = {
			"token": tokens,
			'uuid': userUUID,
			'SESSIONID': sessionID
		}
	}


}

/***

响应拦截器
*/
http.interceptor.response = (response) => {
		//判断返回状态 执行相应操作

		setTimeout(function() {

			if (response.data.code === 406) {
				uni.showModal({
					title: response.data.msg,
					showCancel: false
				});
			}
			if (response.statusCode !== 200) {
				uni.showModal({
					title: '服务器连接异常，请联系管理员',
					showCancel: false
				});
			}
			uni.hideLoading();
		}, 500);

		return response;
	},





	Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
