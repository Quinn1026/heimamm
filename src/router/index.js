// 导入vue 和 vue-router
import Vue from 'vue'
import VueRouter from 'vue-router'

// 注册路由插件
Vue.use(VueRouter)

// 导入组件
import login from '@/views/login'
import layout from '@/views/layout'

// 实例化router插件并配置
const router = new VueRouter({
    routes: [
        { path: '*', redirect: '/login' },
        { path: '/login', component: login },
        { path: '/layout', component: layout },
    ]
})

export default router