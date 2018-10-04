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
  }
}
</script>

<template>
  <div id="app">
    <main>
      <Navbar/>
      <div class="container">
        <router-view/>
      </div>
      <Footer/>
    </main>

    <Icons/>
  </div>

</template>

<style>
#app {
  margin-top: 5em;
  margin-bottom: 5em;
}
</style>
