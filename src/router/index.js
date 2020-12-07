import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'

import User from '../views/sys/User.vue'
import Role from '../views/sys/Role.vue'
import Menu from '../views/sys/Menu.vue'

import Company from '../views/basic/Company.vue'
import Device from '../views/basic/Device.vue'
import Node from '../views/basic/Node.vue'

import RealData from '../views/stat/RealData.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        // redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                name: 'Welcome',
                component: Welcome
            },
            {
                path: '/user',
                name: 'user',
                component: User,
                meta: {
                    firstNode: '用户管理',
                    secondNode: '用户列表'
                }
            },
            {
                path: '/role',
                name: 'role',
                component: Role,
                meta: {
                    firstNode: '角色管理',
                    secondNode: '角色列表'
                }
            },
            {
                path: '/menu',
                name: 'menu',
                component: Menu,
                meta: {
                    firstNode: '菜单管理',
                    secondNode: '菜单列表'
                }
            },
            {
                path: '/company',
                name: 'company',
                component: Company,
                meta: {
                    firstNode: '企业管理',
                    secondNode: '企业列表'
                }
            },
            {
                path: '/device',
                name: 'device',
                component: Device,
                meta: {
                    firstNode: '设备管理',
                    secondNode: '设备列表'
                }
            },
            {
                path: '/node',
                name: 'node',
                component: Node,
                meta: {
                    firstNode: '节点管理',
                    secondNode: '节点列表'
                }
            },
            {
                path: '/realdata',
                name: 'realdata',
                component: RealData,
                meta: {
                    firstNode: '统计数据',
                    secondNode: '实时数据'
                }
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示方行
    // next() 放行    next(/login) 强行跳转
    if (to.path === '/login') {
        return next()
    }
    // token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        return next('/login')
    }
    next()
})

export default router
