import { mapState } from 'vuex'

export const mqtt = {
  data () {
    return {
      MQTT: require('mqtt')
    }
  },
  methods: {
    connect: function () {
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
      this.status.push(
        `connecting to: ${process.env.MQTT_PROTOCOL}://${this.auth.user.username}@${process.env.MQTT_HOST}:${process.env.MQTT_PORT}...`
      )
      var options = {
        username: this.auth.user.username,
        password: this.auth.user.password,
        useSSL: false,
        clientId:
          this.auth.user.username +
          '_' +
          Math.random()
            .toString(16)
            .substr(2, 8)
      }
      // CONNECT TO BROKER
      this.client = this.MQTT.connect(
        `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${
          process.env.MQTT_PORT
        }`,
        options
      )
      this.client.on('connect', this.onConnect)
      this.client.on('message', this.onMessage)
    },
    disconnect: function () {
      // @todo: this.client.unsubscribe()
    },
    onConnect: function (connack) {
      this.mqtt.connected = true
      this.status.push(`Connected to ${process.env.MQTT_HOST}`)
      if (connack.returnCode > 0) {
        this.status.push(
          'unable to connect to: connected to broker'
        )
        this.mqtt.connected = false
      } else {
        this.mqtt.connected = true
      }
    },
    onMessage: function (topic, message) {
      console.log('Message Received', topic, message)
      this.lastMessage = message
    },
    onDisconnect: function (connack) {
      this.status.push('disconnect callback', connack)
      if (connack.returnCode > 0) {
        this.status.push(
          'Unable to disconnect to: ' + this.mqtt.pubTopic
        )
        this.mqtt.connected = true
      } else {
        this.mqtt.connected = false
      }
    },
    onConnectionLost: function () {
      console.log('onConnectionLost', arguments)
    }
  },
  mounted () {
    this.status.push('loaded')
    this.connect()
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
    },
    lastMessage: {
      get: function () {
        return this.mqtt.lastMessage
      },
      set: function (newVal) {
        this.$store.commit('lastMessage', newVal)
      }
    },
    ...mapState(['lang', 'auth', 'mqtt'])
  }
}
