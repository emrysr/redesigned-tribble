import Vue from 'vue'
import Router from 'vue-router'
// components used in router view
import Login from '@/components/Login'
import Inputs from '@/components/Inputs'
import Feeds from '@/components/Feeds'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/feeds',
      name: 'Feeds',
      component: Feeds
    },
    {
      path: '/inputs',
      name: 'Inputs',
      component: Inputs
    }
  ],
  linkActiveClass: 'active'
})
