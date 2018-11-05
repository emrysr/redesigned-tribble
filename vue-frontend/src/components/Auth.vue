<!-- used as the base component to 'save-as' a new component -->
<template>
    <ul class="navbar-nav">
        <router-link tag="li" v-if="!authenticated" class="nav-link" to="/login"><a class="nav-link">Login</a></router-link>
        <router-link tag="li" v-if="authenticated" class="nav-link" to="/logout"><a class="nav-link">Logout</a></router-link>
    </ul>
</template>

<script>
export default {
  name: 'Auth',
  props: ['authenticated']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
