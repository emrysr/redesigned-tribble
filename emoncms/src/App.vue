<template>
  <div id="app">
    <main>
      <Navbar :apikey="apikey" />
      <div class="container">
        <router-view :apikey="apikey" />
      </div>
      <Footer/>
    </main>
    <Icons/><!-- list of svg icons -->
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Icons from '@/components/Icons'
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: 'App',
  components: {
    'Navbar': Navbar,
    'Footer': Footer,
    'Icons': Icons
  },
  data () {
    return {
      apikey: ''
    }
  },
  mounted () {
    if (localStorage.apikey) {
      this.apikey = localStorage.apikey
    }
  },
  watch: {
    apikey (newKey) {
      localStorage.apikey = newKey
    }
  }
}
</script>

<style>
#app {
  margin-top: 5em;
  margin-bottom: 5em;
}
</style>
