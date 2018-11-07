<template>
    <div class="jumbotron py-4">
      <h1 class="display-4">{{$appName}}</h1>
      <p class="lead">{{ $t("message.loggedOut") }}</p>
      <router-link class="btn btn-secondary" to="/login">{{$t("message.login")}}</router-link>
    </div>
</template>

<script>
import { auth } from '@/components/mixins/authenticate'
import { mqtt } from '@/components/mixins/mqtt' // eslint-disable-line no-unused-vars, no-undef

export default {
  name: 'Logout',
  props: ['app'],
  mixins: [auth, mqtt],
  i18n: {
    messages: {
      en: { message: { loggedOut: 'Logged Out', login: 'Login' } },
      cy: { message: { loggedOut: 'Wedi allgofnodi', login: 'Mewngofnodwch' } }
    }
  },
  mounted () {
    this.unauthenticate(this.$t('loggedOut'))
    this.disconnect()
  }
}
</script>
