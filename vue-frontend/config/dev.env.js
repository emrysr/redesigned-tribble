'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MQTT_PROTOCOL: '"wss"',
  MQTT_HOST:'"mqtt.emoncms.org"',
  MQTT_TLS: 'true',
  MQTT_PORT: '8083',
  AUTH_URL: '"http://localhost:8888/auth/"'
})
