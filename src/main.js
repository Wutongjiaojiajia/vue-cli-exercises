import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './components';  //引入 扫描全局对象并自动注册

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
