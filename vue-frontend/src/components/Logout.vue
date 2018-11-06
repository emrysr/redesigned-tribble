<template>
    <div class="jumbotron py-4">
      <h1 class="display-4">{{$appName}}</h1>
      <p class="lead">{{ $t("message.loggedOut") }}</p>
      <router-link class="btn btn-primary" to="/login">{{$t("message.login")}}</router-link>
    </div>
</template>

<script>

export default {
  name: 'Logout',
  props: ['app'],
  i18n: {
    messages: {
      en: { message: { loggedOut: 'Logged Out', login: 'Login' } },
      cy: { message: { loggedOut: 'Wedi allgofnodi', login: 'Mewngofnodwch' } }
    }
  },
  mounted () {
    this.app.authenticated = false
  }

}
</script>
