import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import '@/plugins/element.js'
import '@/assets/reset.css'
import axios from 'axios'
axios.defaults.baseURL = 'https://www.hzmusic.top/'
axios.defaults.withCredentials = true

Vue.prototype.$http = axios
new Vue({
	render: h => h(App),
	router,
	store,
}).$mount('#app')
