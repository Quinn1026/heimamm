import Vue from 'vue'
import App from './App.vue'
// import axios from 'axios'

Vue.config.productionTip = false

// 导入less
import '@/styles/base.less'
// 导入路由模块
import router from '@/router'
// 导入element模块
import '@/plugins/ElementUI.js'
// 导入axios模块
import '@/utils/axios.js'
// 导入vuex模块
import store from '@/store'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')