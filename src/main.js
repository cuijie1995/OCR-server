import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'


import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


import '@/assets/iconfont/iconfont.css'


import '@/assets/iconfont/iconfont.css'















// Vue.prototype.url = 'http://192.168.0.196:8880';

Vue.prototype.url = 'http://yun.witsoftware.cn:8880';


Vue.config.productionTip = false
Vue.prototype.$axios = axios;





new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')