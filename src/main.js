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

new Vue({
  render: h => h(App),
  router
}).$mount('#app')