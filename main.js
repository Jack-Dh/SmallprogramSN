import Vue from 'vue'
import App from './App'
import http from './common/http/index.js'


/**
 * 
 * Vuex全局变量
 */
import store from './stroe/index.js'

Vue.prototype.$store = store;


http.interceptor.request = (config) => {
    //添加通用参数
    config.header = {
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}




Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
