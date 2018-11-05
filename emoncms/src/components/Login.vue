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
                  <input v-model="username" type="text" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter emoncms username">
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
                  <small id="emailHelp" class="form-text text-muted"><a href="https://emoncms.org/">Forgotton password?</a></small>
                </div>
                <div class="form-group form-check">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1">
                  <label class="form-check-label" for="exampleCheck1">Remember me on this device</label>
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
        <h4>Welcome back Dave</h4>
        <router-link to="/feeds" class="btn btn-success btn-lg">Feeds</router-link>
        <router-link to="/inputs" class="btn btn-success btn-lg">Inputs</router-link>
      </div>
      {{ info }}
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
      info: 'start',
      username: 'emrys',
      password: '&PbYyfViBwy0iuk4o6xWu@25'
    }
  },
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: { message: { hello: 'Welcome to ' } },
      cy: { message: { hello: 'Croeso i ' } }
    }
  },
  methods: {
    login: function (event) {
      event.preventDefault()
      // @todo: call the emoncms authenticate api endpoint
      var authenticated = true
      this.info = 'loading'

      axios({
        method: 'post',
        url: 'http://localhost:8888/auth/' + this.username + '/' + this.password,
      }).then(response => (this.info = response))

      if (authenticated) {
        this.authenticate()
      } else {
        this.unauthenticate()
      }
    },
    authenticate: function () {
      global.$('#login-modal').modal('hide')
      this.app.authenticated = true
    },
    unauthenticate: function () {
      this.app.authenticated = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
