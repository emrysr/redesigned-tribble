'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MQTT_PROTOCOL: '"wss"', // [mqtt,mqtts,ws,wss]
  MQTT_HOST:'"mqtt.emoncms.org"', // 'ws://sheeppen.ddns.net:1884'
  MQTT_TLS: 'true',
  MQTT_PORT: '8083'
})
