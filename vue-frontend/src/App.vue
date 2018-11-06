<template>
  <div id="app" class="mt-3">
    <main :class="{'bg-dark':!app.authenticated}">
      <!-- <Mqtt :app="app" /> -->
      <Navbar :app="app" />
      <div class="container mt-4">
        <router-view :app="app" />
      </div>
      <Footer :app="app" />
    </main>
    <Icons /><!-- list of svg icons -->
  </div>
</template>

<script>
// import Mqtt from '@/components/Mqtt'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Icons from '@/components/Icons'

import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: 'App',
  components: {
    // 'Mqtt': Mqtt,
    'Navbar': Navbar,
    'Footer': Footer,
    'Icons': Icons
  },
  data () {
    return {
      app: {
        lang: 'en',
        authenticated: false,
        mqtt: {
          client: false,
          status: [],
          connected: false,
          username: '',
          password: ''
        }
      }
    }
  }
}
</script>
