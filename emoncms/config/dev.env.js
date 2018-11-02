'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"http://localhost:80/emoncms"',
  API_KEY:  '"cb9579be83678b89a5eb0faea08ad839"',
  MQTT_PROTOCOL: '"wss"', // [mqtt,mqtts,ws,wss]
  MQTT_HOST:'"mqtt.emoncms.org"', // 'ws://sheeppen.ddns.net:1884'
  MQTT_TLS: 'true',
  MQTT_USER: '"emrys"',
  MQTT_PASS: '"emrys"',
  MQTT_PORT: '8083'
})
