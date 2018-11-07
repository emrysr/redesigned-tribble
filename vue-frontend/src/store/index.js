import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    lang: 'en',
    auth: {
      username: '',
      password: '',
      user: null
    },
    mqtt: {
      client: false,
      status: [],
      connected: false
    }
  },
  getters: {
    // Compute derived state based on the current state. More like computed property.
  },
  mutations: {
    lang (state, lang) {
      state.lang = lang
    },
    status (state, status) {
      state.mqtt.status = status
    },
    user (state, user) {
      state.auth.user = user
    }
  },
  actions: {
    // Get data from server and send that to mutations to mutate the current state
  }
})

// store.commit('updateLang','cy')
