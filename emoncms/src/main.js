// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import jQuery from 'jquery'
import 'bootstrap/dist/css/bootstrap.css'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

global.$ = jQuery
// eslint-disable-next-line no-unused-vars
let Bootstrap = require('bootstrap')

Vue.config.productionTip = false
Vue.prototype.$appName = 'emonCMS'

// Ready translated locale messages
const messages = {
  en: {
    message: {
      search: 'Search'
    }
  },
  cy: {
    message: {
      search: 'Chwiliwch'
    }
  },
  es: {
    message: {
      search: 'Buscar'
    }
  },
  fr: {
    message: {
      search: 'Chercher'
    }
  }
}

// Create VueI18n instance with options
// eslint-disable-next-line no-unused-vars
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
  silentTranslationWarn: true,
  fallbackLocale: 'en',
  missing: function (locale, path, vm) {
    return ['i18n missing', locale, path, vm]
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
