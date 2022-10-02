import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import '@/plugins/element.js'
import '@/assets/reset.css'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')