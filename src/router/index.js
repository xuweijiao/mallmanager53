import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login/login.vue'
//@会自动帮我们找到src文件夹，是webpack自动封装好的功能
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home
    }
  ]
})
