<template>
  <div id="app" class="mt-3">
    <main>
      <Navbar />
      <div class="container mt-4">
        <router-view /><!-- see router/index.js to see which component is loaded -->
      </div>
      <Footer />
    </main>
    <Icons /><!-- list of svg icons -->
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
  mounted: function () {
    this.$root.$data.auth.user = JSON.parse(localStorage.getItem('user'))
  }
}
</script>
