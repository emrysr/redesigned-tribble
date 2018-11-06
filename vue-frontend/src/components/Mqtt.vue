<template>
  <div>
    <button @click="connect()" class="btn btn-sm btn-light">Connect</button>
  </div>
</template>

<script>
import { mqtt } from './mixins/mqtt'

export default {
  name: 'Mqtt',
  props: ['app'],
  mixins: [mqtt],
  watch: {
    app: function (newVal) {
      console.log(this.store.mqtt.connected)
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
