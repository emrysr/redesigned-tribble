export const mqtt = {
  data () {
    return {
      MQTT: require('mqtt')
    }
  },
  methods: {
    connect () {
      this.app.mqtt.status.push('connecting...')
      if (!this.mqtt || !this.app.mqtt.connected) return void 0
      this.app.mqtt.status.push(`connecting to: ${process.env.MQTT_PROTOCOL}://${this.app.mqtt.username}@${process.env.MQTT_HOST}:${process.env.MQTT_PORT}...`)
      var options = {
        username: this.app.mqtt.username,
        password: this.app.mqtt.password,
        useSSL: true
      }
      this.app.mqtt.client = this.MQTT.connect(`${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, options)
      this.app.mqtt.client.on('disconnect', this.onDisconnect)
      this.app.mqtt.client.on('connect', this.onConnect)
    },
    onDisconnect () {
      this.app.mqtt.status.push('onDisconnect')
    },
    onConnect () {
      this.app.mqtt.status.push('Connected')
      this.app.mqtt.connected = true
    }
  }
}
