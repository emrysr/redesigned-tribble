<template>
  <div class="jumbotron py-4">
    <h1 class="display-4">{{$t("message.hello") + $appName}}</h1>
    <p class="lead">{{lead}}</p>
    <hr class="my-4">
    <p>{{intro}}</p>
    <div v-if="!this.auth.user">
      <button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#login-modal">Login</button>
      <Login />
    </div>
    <div v-else>
      <router-link to="/feeds" class="btn btn-success btn-lg">Feeds</router-link>
      <router-link to="/inputs" class="btn btn-success btn-lg">Inputs</router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mqtt } from '@/components/mixins/mqtt' // eslint-disable-line no-unused-vars, no-undef
import Login from '@/components/Login'

export default {
  name: 'Welcome',
  components: {
    'Login': Login
  },
  mixins: [mqtt],
  computed: mapState(['auth']),
  data () {
    return {
      lead: 'Web-app for processing, logging and visualising energy, temperature and other environmental data',
      intro: 'Emoncms is a powerful open-source web-app for processing, logging and visualising energy, temperature and other environmental data.'
    }
  },
  i18n: {
    messages: {
      en: { message: { hello: 'Welcome to ' } },
      es: { message: { hello: 'Bienvenido a ' } },
      fr: { message: { hello: 'Bienvenue à ' } },
      cy: { message: { hello: 'Croeso i ' } }
    }
  }
}
</script>
