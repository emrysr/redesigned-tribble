<template>
    <div class="jumbotron py-4">
      <h1 class="display-4">{{$appName}}</h1>
      <p class="lead">{{ $t("message.loggedOut") }}</p>
    </div>
</template>

<script>

export default {
  name: 'Logout',
  props: ['app'],
  i18n: {
    messages: {
      en: { message: { loggedOut: 'Logged Out' } },
      cy: { message: { loggedOut: 'Wedi allgofnodi' } }
    }
  },
  mounted () {
    this.app.authenticated = false
  }

}
</script>
