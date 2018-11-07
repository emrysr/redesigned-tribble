import Vue from 'vue'
import Router from 'vue-router'
// components used in router view
import Welcome from '@/components/Welcome'
import Logout from '@/components/Logout'
import Feeds from '@/components/Feeds'
import Inputs from '@/components/Inputs'

// import store from '../store'

Vue.use(Router)

let router = new Router({
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
      component: Feeds,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/inputs',
      component: Inputs,
      meta: {
        requiresAuth: true
      }
    }
  ],
  linkActiveClass: 'active'
})

// add check for authorised users. next() if valid
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user === null) { // redirect to login
      next({
        path: '/login',
        params: {nextUrl: to.fullPath}
      })
    } else {
      if (to.matched.some(record => record.meta.is_admin)) {
        if (user.is_admin === 1) {
          next() // ok -- user is admin
        } else {
          next(false) // bail -- user not admin
        }
      } else {
        next() // route is not admin only
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') === null) {
      next()
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
