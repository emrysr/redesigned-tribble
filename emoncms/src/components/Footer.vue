<template>
  <nav class="navbar fixed-bottom navbar-light bg-light">
    <div class="container d-flex justify-content-center">
      <span class="navbar-text">
        <div class="btn-group" role="group" aria-label="Basic example">
          <router-link v-for="routes in links"
             v-bind:key="routes.id"
             :to="`${routes.page}`" class="btn btn-link btn-sm text-muted">{{routes.title}}</router-link>

          <a href="https://github.com/emoncms/emoncms" class="btn btn-link btn-sm text-muted" title="Project Code" target="_blank">Open Source on github</a>
          <a href="https://emoncms.org" class="btn btn-link btn-sm text-muted" title="Project Site" target="_blank">emoncms.org 🄯 2019</a>
          <small class="btn-sm text-muted">{{ localApiKey }}</small>
        </div>
      </span>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Footer',
  data: function () {
    return {
      localApiKey: process.env.API_KEY,
      links: [
        {id: 1, page: '/', title: this.$appName}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
