import Vue from 'vue'
import Router from 'vue-router'
// components used in router view
import Login from '@/components/Login'
import Inputs from '@/components/Inputs'
import Feeds from '@/components/Feeds'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/dev',
      component: HelloWorld
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/feeds',
      component: Feeds,
      props: {apikey: this.apikey}
    },
    {
      path: '/inputs',
      component: Inputs
    }
  ],
  linkActiveClass: 'active'
})
