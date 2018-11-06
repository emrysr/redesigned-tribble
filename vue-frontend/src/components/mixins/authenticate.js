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
        url: (process.env.AUTH_URL + this.app.mqtt.username + '/' + this.app.mqtt.password)
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
      this.app.authenticated = true
      this.error = ''
    },
    unauthenticate: function (message) {
      this.app.authenticated = false
      this.error = message
    }
  }
}
