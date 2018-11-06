<template>
    <div class="jumbotron py-4">
      <h1 class="display-4">{{$t("message.hello") + $appName}}</h1>
      <p class="lead">{{lead}}</p>
      <hr class="my-4">
      <p>{{intro}}</p>
      <div v-if="!app.authenticated">
        <button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#login-modal">Login</button>
        <div id="login-modal" class="modal" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <form id="login-form" class="modal-content" action="https://emoncms.org/user/login.json" method="POST" @submit="login">
              <div class="modal-header">
                <h5 class="modal-title">Login to EmonCMS</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label for="email">Username</label>
                  <input v-model="app.mqtt.username" type="text" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter emoncms username">
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input v-model="app.mqtt.password" type="password" class="form-control" id="password" placeholder="Password">
                  <small id="emailHelp" class="form-text text-muted"><a href="https://emoncms.org/">Forgotton password?</a></small>
                </div>
                <div v-if="error" class="alert alert-warning">
                  {{error}}
                </div>
                <div v-if="false" class="form-group form-check">
                  <input type="checkbox" class="form-check-input" id="rememberme">
                  <label class="form-check-label" for="rememberme">Remember me</label>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div v-else>
        <router-link to="/feeds" class="btn btn-success btn-lg">Feeds</router-link>
        <router-link to="/inputs" class="btn btn-success btn-lg">Inputs</router-link>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  props: ['app'],
  data () {
    return {
      lead: 'Web-app for processing, logging and visualising energy, temperature and other environmental data',
      intro: 'Emoncms is a powerful open-source web-app for processing, logging and visualising energy, temperature and other environmental data.',
      error: ''
    }
  },
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: { message: { hello: 'Welcome to ' } },
      es: { message: { hello: 'Bienvenido a ' } },
      fr: { message: { hello: 'Bienvenue à ' } },
      cy: { message: { hello: 'Croeso i ' } }
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
</script>
