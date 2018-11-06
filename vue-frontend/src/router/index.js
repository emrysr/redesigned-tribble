import Vue from 'vue'
import Router from 'vue-router'
// components used in router view
import Welcome from '@/components/Welcome'
import Logout from '@/components/Logout'
import Feeds from '@/components/Feeds'
import Inputs from '@/components/Inputs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Welcome
    },
    {
      path: '/logout',
      component: Logout
    },
    {
      path: '/feeds',
      component: Feeds
    },
    {
      path: '/inputs',
      component: Inputs
    }
  ],
  linkActiveClass: 'active'
})
