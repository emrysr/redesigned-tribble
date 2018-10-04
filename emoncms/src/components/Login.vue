<template>
    <div class="jumbotron py-4">
    <h1 class="display-2">{{$t("message.hello") + $appName}}</h1>
    <p class="lead">{{lead}}</p>
    <hr class="my-4">
    <p>{{intro}}</p>

    <router-link to="/feeds" class="btn btn-primary btn-lg">Learn more</router-link>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      lead: 'Web-app for processing, logging and visualising energy, temperature and other environmental data',
      intro: 'Emoncms is a powerful open-source web-app for processing, logging and visualising energy, temperature and other environmental data.'
    }
  },
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: { message: { hello: 'Welcome to ' } },
      cy: { message: { hello: 'Croeso i ' } }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
