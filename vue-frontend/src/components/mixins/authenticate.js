import axios from 'axios'

export const auth = {
  data: function () {
    return {
      error: '',
      username: '',
      password: ''
    }
  },
  methods: {
    login: function (event) {
      event.preventDefault()
      let that = this
      this.username = event.target.querySelector('#input_username').value
      this.password = event.target.querySelector('#input_password').value
      axios({
        method: 'post',
        url: (process.env.AUTH_URL + this.username + '/' + this.password)
      }).then(function (response) {
        let success = (response.data && response.data.success) || false
        if (success) {
          that.authenticate(response.data)
        } else {
          that.unauthenticate(response.data.message)
        }
      })
    },
    authenticate: function (data) {
      global.$('#login-modal').modal('hide')
      let user = {
        username: this.username,
        password: this.password,
        userid: data.userid,
        apikey_write: data.apikey_write,
        apikey_read: data.apikey_read
      }
      localStorage.setItem('user', JSON.stringify(user))
      this.$root.$data.auth.user = user
      this.error = ''
      // if (typeof this.connect === 'function') this.connect()
    },
    unauthenticate: function (message) {
      this.error = message
      this.$root.$data.auth.user = null
      localStorage.removeItem('user')
      // if (typeof this.disconnect === 'function') this.disconnect()
    }
  }
}
