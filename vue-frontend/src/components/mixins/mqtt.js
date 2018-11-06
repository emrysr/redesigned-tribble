export const mqtt = {
  data () {
    return {
      MQTT: require('mqtt')
    }
  },
  methods: {
    connect () {
      this.store.mqtt.status.push('connecting...')
      if (!this.mqtt || !this.store.mqtt.connected) return void 0
      this.store.mqtt.status.push(`connecting to: ${process.env.MQTT_PROTOCOL}://${this.store.mqtt.username}@${process.env.MQTT_HOST}:${process.env.MQTT_PORT}...`)
      var options = {
        username: this.store.mqtt.username,
        password: this.store.mqtt.password,
        useSSL: true
      }
      this.store.mqtt.client = this.MQTT.connect(`${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, options)
      this.store.mqtt.client.on('disconnect', this.onDisconnect)
      this.store.mqtt.client.on('connect', this.onConnect)
    },
    onDisconnect () {
      this.store.mqtt.status.push('onDisconnect')
    },
    onConnect () {
      this.store.mqtt.status.push('Connected')
      this.store.mqtt.connected = true
    }
  }
}
