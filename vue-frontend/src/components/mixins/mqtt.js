export const mqtt = {
  data () {
    return {
      MQTT: require('mqtt')
    }
  },
  methods: {
    mqtt_connect () {
      if (typeof this.MQTT !== 'function') {
        this.status.push(`ERROR: MQTT library not ready.`)
        return void 0
      }
      if (this.mqtt.connected) {
        this.status.push(`NOTICE: already connected.`)
        return void 0
      }
      if (!this.auth.user || this.auth.user.username === '') {
        this.status.push(`ERROR: empty username.`)
        return void 0
      }
      this.status.push(`connecting to: ${process.env.MQTT_PROTOCOL}://${this.auth.user.username}@${process.env.MQTT_HOST}:${process.env.MQTT_PORT}...`)
      var options = {
        username: this.auth.user.username,
        password: this.auth.user.password,
        useSSL: false,
        clientId: this.auth.user.username + '_' + Math.random().toString(16).substr(2, 8)
      }
      this.client = this.MQTT.connect(`${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, options)
      this.client.on('disconnect', this.onDisconnect)
      this.client.on('connect', this.onConnect)
    },
    onDisconnect () {
      // overwritten by component method of same name
    },
    onConnect () {
      // overwritten by component method of same name
    }
  },
  mounted () {
    this.status.push('connecting...')
    this.mqtt_connect()
  },
  computed: {
    client: {
      get: function () {
        return this.mqtt.client
      },
      set: function (newVal) {
        this.mqtt.client = newVal
      }
    },
    status: {
      get: function () {
        return this.mqtt.status
      },
      set: function (newVal) {
        this.$store.commit('status', newVal)
      }
    }

  }
}
