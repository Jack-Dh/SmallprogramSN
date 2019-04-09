import Vue from 'vue'
import App from './App'


/**
 * 
 * Vuex全局变量
 */
import store from './stroe/index.js'
Vue.prototype.$store = store;



Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
