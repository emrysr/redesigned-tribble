import Vue from 'vue'
import Router from 'vue-router'
// components used in router view
import Login from '@/components/Login'
import Logout from '@/components/Logout'
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
      component: Login,
      props: {authenticated: this.authenticated}
    },
    {
      path: '/logout',
      component: Logout,
      props: {authenticated: this.authenticated}
    },
    {
      path: '/feeds',
      component: Feeds,
      props: {apikey: this.apikey, authenticated: this.authenticated}
    },
    {
      path: '/inputs',
      component: Inputs,
      props: {apikey: this.apikey, authenticated: this.authenticated}
    }
  ],
  linkActiveClass: 'active'
})
