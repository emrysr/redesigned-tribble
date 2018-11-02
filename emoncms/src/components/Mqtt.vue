<!-- used as the base component to 'save-as' a new component -->
<template>
    <div>
        <h4 v-if="app.connected">{{ $t('message.connected') }}</h4>
        <h4 v-else>{{ $t('message.disconnected') }}</h4>
        <h5>{{ app.mqtt.status | last }}</h5>
    </div>
</template>

<script>

export default {
  name: 'Mqtt',
  props: ['app'],
  data () {
    return {
      mqtt: require('mqtt')
    }
  },
  methods: {
    connect: function () {
      if (!this.mqtt) return void 0
      this.app.mqtt.status.push('connect()')
      var options = {
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PASS,
        useSSL: true
      }
      this.app.mqtt.client = this.mqtt.connect(process.env.MQTT_PROTOCOL + '://' + process.env.MQTT_HOST + ':' + process.env.MQTT_PORT, options)
      this.app.mqtt.client.on('disconnect', this.onDisconnect)
    },
    onDisconnect: function () {
      this.app.mqtt.status.push('onDisconnect')
    }
  },
  mounted () {
    this.connect()
  },
  filters: {
    last: function (arr) {
      return arr[arr.length - 1]
    }
  },
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: { message: {
        connected: 'Connected',
        disconnected: 'Disconnected'
      }
      },
      cy: { message: {
        connected: 'Wedi cysylltu',
        disconnected: 'Ddim wedi cysylltu'
      }
      }
    }
  }
}
</script>
