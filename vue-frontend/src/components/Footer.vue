<template>
  <nav class="navbar fixed-bottom navbar-light bg-light">
    <div class="container d-flex justify-content-center">
      <span class="navbar-text">
        <div class="btn-group" role="group" aria-label="footer links">
          <router-link v-for="routes in links"
             v-bind:key="routes.id"
             :to="`${routes.page}`" class="btn btn-link btn-sm text-muted">{{routes.title}}</router-link>

          <a href="https://github.com/emoncms/emoncms" class="btn btn-link btn-sm text-muted" title="Project Code" target="_blank">Source on Github</a>
          <a href="https://emoncms.org" class="btn btn-link btn-sm text-muted" title="Project Site" target="_blank">emoncms.org 🄯 2019</a>
        </div>
      </span>
    </div>
    <div class="container d-flex justify-content-center">
      <small class="text-muted text-center">{{ store.mqtt.status[store.mqtt.status.length - 1] }}</small>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Footer',
  props: ['app'],
  data: function () {
    return {
      links: [
        {id: 1, page: '/', title: this.$appName}
      ]
    }
  }
}
</script>
