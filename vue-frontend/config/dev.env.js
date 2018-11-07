'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MQTT_PROTOCOL: '"ws"',
  MQTT_HOST: '"localhost"',
  MQTT_TLS: 'false',
  MQTT_PORT: '9001',
  AUTH_URL: '"http://localhost:8888/auth/"'
})
