<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link to="/" class="navbar-brand">{{$parent.projectName}}</router-link>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <router-link v-for="routes in links"
             v-bind:key="routes.id"
             tag="li"
             class="nav-item" :to="`${routes.page}`"><a :href="routes.page" class="nav-link">{{routes.title}}</a></router-link>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2">
            <div class="input-group-append">
              <button class="btn btn-success">Search</button>
            </div>
          </div>
        </form>
      </div>
    </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data: function () {
    return {
      links: [
        {id: 1, page: '/feeds', title: 'Feeds'},
        {id: 2, page: '/inputs', title: 'Inputs'}
      ]
    }
  },
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
