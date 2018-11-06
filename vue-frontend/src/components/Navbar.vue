<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
    <div class="container">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNavbarToggler" aria-controls="mainNavbarToggler" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link to="/" class="navbar-brand">
      <small v-if="false" class="pr-2 position-absolute badge badge-rounded badge-info" style="margin-left:-2em">
        <span class="d-block d-sm-none">xs</span>
        <span class="d-none d-sm-block d-md-none">sm</span>
        <span class="d-none d-md-block d-lg-none">md</span>
        <span class="d-none d-lg-block d-xl-none">lg</span>
        <span class="d-none d-xl-block">xl</span>
      </small>
      <span id="mqttIndicator" class="rounded-circle d-inline-block" :class="{'bg-success':store.mqtt.connected,'bg-light':!store.mqtt.connected,'opaque':!store.mqtt.connected}"></span>
      {{$appName}}
      </router-link>
      <Nav :app="app" />
    </div>
  </nav>
</template>

<script>
import Nav from '@/components/Nav'

export default {
  props: ['app'],
  components: {
    'Nav': Nav
  },
  data: function () {
    return {
      isAdmin: false
    }
  },
  name: 'Navbar',
  mounted () {
    this.$nextTick(() => {
      global.$('.navbar').hide().fadeIn('slow')
    })
  }
}
</script>

<style scoped>
#mqttIndicator {
  font-size:1rem;
  width:1rem;
  height:1rem;
}
.opaque{opacity:.2}
</style>
