import axios from 'axios'

export const auth = {
  data: function () {
    return {
      error: ''
    }
  },
  methods: {
    login: function (event) {
      event.preventDefault()
      let that = this
      axios({
        method: 'post',
        url: (process.env.AUTH_URL + this.store.mqtt.username + '/' + this.store.mqtt.password)
      }).then(function (response) {
        let success = (response.data && response.data.success) || false
        if (success) {
          that.authenticate()
        } else {
          that.unauthenticate(response.data.message)
        }
      })
    },
    authenticate: function () {
      global.$('#login-modal').modal('hide')
      this.store.authenticated = true
      this.error = ''
    },
    unauthenticate: function (message) {
      this.store.authenticated = false
      this.error = message
    }
  }
}
