<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default {
  name: 'App',
  components: {
    'Navbar': Navbar,
    'Footer': Footer
  },
  data: function () {
    return {
      projectName: 'eMonCMS'
    }
  }
}
</script>

<template>
  <div id="app">
    <Navbar/>
    <div class="container">
      <router-view/>
    </div>
    <Footer/>
  </div>
</template>

<style>
#app {
  margin-top: 60px;
}
</style>
