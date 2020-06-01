// 导入vue 和 vue-router
import Vue from 'vue'
import VueRouter from 'vue-router'

// 注册路由插件
Vue.use(VueRouter)

// 导入token模块
import {
    getToken
} from '@/utils/token.js'

// 导入组件
import login from '@/views/login'
import layout from '@/views/layout'
// 导入layout组件的嵌套组件
import chart from '@/views/layout/chart'
import enterprise from '@/views/layout/enterprise'
import question from '@/views/layout/question'
import subject from '@/views/layout/subject'
import user from '@/views/layout/user'
// 导入test测试组件
import slot1 from '@/test/slot1'

// 实例化router插件并配置
const router = new VueRouter({
    routes: [{
            path: '*',
            redirect: '/login'
        },
        {
            path: '/login',
            component: login
        },
        {
            path: '/layout',
            component: layout,
            children: [{
                    path: 'chart',
                    component: chart,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-pie-chart",
                        fullPath: "/layout/chart",
                        title: "数据预览",
                    },
                },
                {
                    path: 'enterprise',
                    component: enterprise,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-office-building",
                        fullPath: "/layout/enterprise",
                        title: "企业列表",
                    },
                },
                {
                    path: 'question',
                    component: question,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师", "学生"],
                        icon: "el-icon-edit-outline",
                        fullPath: "/layout/question",
                        title: "题库列表",
                    },
                },
                {
                    path: 'subject',
                    component: subject,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-notebook-2",
                        fullPath: "/layout/subject",
                        title: "学科列表",
                    },
                },
                {
                    path: 'user',
                    component: user,
                    meta: {
                        roles: ["超级管理员", "管理员", "老师"],
                        icon: "el-icon-user",
                        fullPath: "/layout/user",
                        title: "用户列表",
                    },
                }
            ]
        },
        {
            path: '/slot1',
            component: slot1
        }
    ]
});
// 全局导航守卫
router.beforeEach((to, from, next) => {
    if (to.fullPath == '/login') {
        next();
    } else {
        // 如果不是去login页面 先判断是否有token
        const token = getToken();
        if (token) {
            // 有token表示已经登陆过了
            next();
        } else {
            // 没有token 表示没有登陆 直接跳转到登录页面
            next('/login');
        }
    }
});
router.afterEach((to, from) => {
    document.title = to.meta.title || '黑马面面'
});

export default router