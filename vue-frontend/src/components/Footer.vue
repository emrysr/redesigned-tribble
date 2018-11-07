<template>
  <nav class="navbar fixed-bottom navbar-light bg-light">
    <div class="container d-flex justify-content-center">
      <span class="navbar-text">
        <div class="btn-group" role="group" aria-label="footer links">
          <a class="btn btn-link btn-sm text-muted"
            :href="link.url"
            :target="link.target"
            v-for="link in links"
            v-bind:key="link.url">
              {{link.label}}
          </a>
        </div>
      </span>
    </div>
    <div class="container d-flex justify-content-center justify-content-between">
      <button class="btn btn-outline-secondary btn-sm" @click="navigate('first')">First</button>
      <button class="btn btn-outline-secondary btn-sm" @click="navigate('prev')">Prev</button>
      <small class="text-muted text-center col-12 col-sm-6 col-lg-8">{{ statusIndex + 1 }} / {{ mqtt.status.length }} {{ statusItem() }} </small>
      <button class="btn btn-outline-secondary btn-sm" @click="navigate('next')">Next</button>
      <button class="btn btn-outline-secondary btn-sm" @click="navigate('last')">Last</button>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Footer',
  props: ['app'],
  data: function () {
    return {
      statusIndex: 0,
      liveStatus: true,
      links: [
        {title: this.$appName, url: '/', label: this.$appName},
        {title: 'Project Code', url: 'https://github.com/emoncms/emoncms', target: '_blank', label: 'Source on Github'},
        {title: 'Project Site', url: 'https://emoncms.org', target: '_blank', label: 'emoncms.org 🄯 2019'}
      ]
    }
  },
  computed: mapState(['lang', 'auth', 'mqtt']),
  methods: {
    statusItem: function () {
      if (this.statusIndex > (this.mqtt.status.length - 1)) this.statusIndex = 0
      if (this.statusIndex < 0) this.statusIndex = this.mqtt.status.length - 1
      if (this.liveStatus) this.statusIndex = this.mqtt.status.length - 1
      return this.mqtt.status[this.statusIndex]
    },
    navigate: function (pos) {
      this.liveStatus = false
      if (pos === 'first') this.statusIndex = 0
      if (pos === 'prev') this.statusIndex--
      if (pos === 'next') this.statusIndex++
      if (pos === 'last') {
        this.statusIndex = this.mqtt.status.length - 1
        this.liveStatus = true
      }
    }
  },
  mounted: function () {
    this.statusIndex = this.mqtt.status.length - 1
  }
}
</script>
