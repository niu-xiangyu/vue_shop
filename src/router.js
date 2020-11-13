import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/User/User.vue'
Vue.use(Router)

const router = new Router({
  routes: [{
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
    redirect: '/welcome',
    children: [{ 
      path: '/welcome',
      component: Welcome 
    },
    {
      path: '/users',
      component: Users
    }
    ]
  }

  ]
})
// 路由导航守卫 控制页面访问权限
router.beforeEach((to, from, next) => {
  // to 将要访问 from 来自 next() 放行
  if (to.path === '/login') return next()
  // 获取token 若未登录则返回登录页面
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
