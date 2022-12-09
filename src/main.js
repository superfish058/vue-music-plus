import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
// import '@/plugins/element.js'
import '@/assets/reset.css'
import axios from 'axios'
import vueTouch from 'kim-vue-touch'
Vue.use(vueTouch)
axios.defaults.baseURL = 'https://www.hzmusic.fit/'
// axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true
// axios.defaults.timeout = 30000
Vue.prototype.$http = axios
new Vue({
	render: h => h(App),
	router,
	store,
}).$mount('#app')
