<template>
  <div id="app">
    <main>
      <Navbar />
      <Mqtt :app="app" />
      <div class="container">
        <router-view :app="app" />
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
import Mqtt from '@/components/Mqtt'

import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: 'App',
  components: {
    'Navbar': Navbar,
    'Footer': Footer,
    'Icons': Icons,
    'Mqtt': Mqtt
  },
  data () {
    return {
      app: {
        apikey: process.env.API_KEY,
        authenticated: false,
        mqtt: {
          client: false,
          status: [],
          connected: false,
          pubTopic: 'user/brynawelon/request',
          subTopic: 'user/brynawelon/response'
        }
      }
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
