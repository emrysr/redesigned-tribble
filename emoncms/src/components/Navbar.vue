<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
    <div class="container">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNavbarToggler" aria-controls="mainNavbarToggler" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link to="/" class="navbar-brand">
        <small class="pr-2 position-absolute badge badge-rounded badge-light" style="margin-left:-2em">
          <span class="d-block d-sm-none">xs</span>
          <span class="d-none d-sm-block d-md-none">sm</span>
          <span class="d-none d-md-block d-lg-none">md</span>
          <span class="d-none d-lg-block d-xl-none">lg</span>
          <span class="d-none d-xl-block">xl</span>
        </small>
      {{$appName}}
      </router-link>
      <div class="collapse navbar-collapse" id="mainNavbarToggler">
        <Nav />

        <Search />

        <LocaleChanger class="ml-2" />
      </div>
    </div>
  </nav>
</template>

<script>
import LocaleChanger from '@/components/LocaleChanger'
import Nav from '@/components/Nav'
import Search from '@/components/Search'

export default {
  components: {
    'LocaleChanger': LocaleChanger,
    'Nav': Nav,
    'Search': Search
  },
  name: 'Navbar',
  mounted () {
    this.$nextTick(() => {
      global.$('.navbar').hide().fadeIn('slow')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
