<template>
<div>

  <section>
    <div class="display-4 d-sm-flex justify-content-between align-items-end">
      <div class="form-inline d-flex align-items-baseline">
        {{ $t("message.feeds") }}:
        <div class="form-group">
          <input id="autorefresh" class="form-check-input" type="checkbox" v-model="autoreload" autocomplete="off">
          <label for="autorefresh" class="form-check-input " :class="{active: autoreload, 'text-secondary': !autoreload, 'text-primary': autoreload}" style="font-size: 1rem">
            auto-refresh ( {{ autoreload  ? 'on': 'off' }} )
          </label>
        </div>
      </div>

      <transition name="fade" v-if="$parent.apikey.length > 0 && errors.length==0">
        <FeedlistToolbar v-if="nodes.length>0" :nodes="nodes"/>
      </transition>
    </div>
  </section>

  <div v-if="$parent.apikey.length == 0" class="alert alert-warning">
    <h4>Empty API key</h4>
    Please enter in your API key. Your API key is found on your account page.
  </div>
  <div v-else>
    <div class="alert alert-danger" v-for="error in errors" v-bind:key="error">{{ error }}</div>
    <button v-if="errors.length>0" @click="getFeedData()" class="btn btn-lg btn-primary">Retry</button>
  </div>
  <div v-if="$parent.apikey.length > 0 && errors.length==0" name="bounce">
    <Node v-for="node in nodes"
      v-bind:key="node.name"
      v-bind:node="node"
    ></Node>
  </div>
</div>

</template>
<script>
import FeedlistToolbar from '@/components/FeedlistToolbar'
import FeedTooltip from '@/components/FeedTooltip'
import Node from '@/components/Node'
import camelCase from 'camelcase'

export default {
  name: 'Feeds',
  components: {
    'FeedlistToolbar': FeedlistToolbar,
    'FeedTooltip': FeedTooltip,
    'Node': Node
  },
  props: ['apikey'],
  data () {
    return {
      msg: 'Feeds List',
      response: null,
      nodes: {},
      errors: [],
      autoreload: true,
      autoreloadDelay: 5000,
      autoreloadInterval: null,
      engines: {
        MYSQL: 0,
        TIMESTORE: 1, // Depreciated
        PHPTIMESERIES: 2,
        GRAPHITE: 3, // Not included in core
        PHPTIMESTORE: 4, // Depreciated
        PHPFINA: 5,
        PHPFIWA: 6,
        VIRTUALFEED: 7, // Virtual feed , on demand post processing
        MYSQLMEMORY: 8, // Mysql with MEMORY tables on RAM. All data is lost on shutdown
        REDISBUFFER: 9, // (internal use only) Redis Read/Write buffer , for low write mode
        CASSANDRA: 10 // Cassandra
      },
      subClient: null,
      pubClient: null,
      mqtt: null,
      status: []
    }
  },
  computed: {
    _apikey: function () {
      return this.$parent.apikey
    },
    getEngineName: function () {
      return function (_id) {
        let engineName = null
        Object.entries(this.engines).forEach(function (value, id) {
          if (id === parseInt(_id)) {
            engineName = value[0]
          }
        })
        return engineName
      }
    }
  },
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: {
        message: {
          feeds: 'Feeds'
        }
      },
      cy: {
        message: {
          feeds: 'Ffrwdau'
        }
      },
      es: {
        message: {
          feeds: 'Feeds es'
        }
      },
      fr: {
        message: {
          feeds: 'Feeds fr'
        }
      }
    }
  },
  methods: {
    connect: function () {
      if (!this.mqtt) return void 0

      console.info('connect()')
      var host = 'ws://localhost:8081'
      // var host = 'ws://sheeppen.ddns.net:1884'
      var options = {
        username: 'emonpi',
        password: 'emonpimqtt2016'
      }
      // ACT ON RESPONSE FROM MQTT
      this.subClient = this.mqtt.connect(host, options)
      this.subClient.on('connect', this.onSubscribeConnect)

      // PUBLISH REQUEST TO MQTT
      this.pubClient = this.mqtt.connect(host, options)
      this.pubClient.on('connect', this.onPublishConnect)
    },
    disconnect: function () {
      // @todo: this should unsubscribe and disconnect from subClient & pubClient
    },
    onSubscribeConnect: function (connack) {
      // console.log('subscribe', connack)
      var subTopic = 'response'
      if (connack.returnCode === 0) {
        this.subClient.on('message', this.onSubscribeMessage)
        this.subClient.subscribe(subTopic)
        this.status.push('connected to: ' + subTopic)
      } else {
        this.status.push('unable to connect to: ' + subTopic)
      }
    },
    onPublishConnect: function (connack) {
      var pubTopic = 'request'
      var emonHost = 'http://localhost:80/emoncms'
      if (connack.returnCode === 0 && !connack.sessionPresent) {
        this.pubClient.publish(pubTopic, emonHost + '/feed/list.json&apikey=' + this.$parent.apikey)
        this.status.push('connected to: ' + pubTopic)
      } else {
        this.status.push('unable to connect to: ' + pubTopic)
      }
    },
    onSubscribeMessage: function (topic, message) {
      console.log('received data:', JSON.parse(message.toString()), new Date().valueOf())
      this.processData(JSON.parse(message.toString()))
    },
    processData: function (data) {
      let that = this
      var nodes = {}
      data.forEach(function (feed) {
        // create array of nodes with array of feeds as a property of each node
        feed.engine_name = that.getEngineName(feed.engine)
        feed.selected = false
        if (!nodes[feed.tag]) {
          nodes[feed.tag] = {
            tag: feed.tag,
            id: camelCase(feed.tag),
            collapsed: true,
            size: 0,
            lastupdate: 0,
            feeds: [],
            status: 'success'
          }
        }
        nodes[feed.tag].size += parseInt(feed.size)
        nodes[feed.tag].lastupdate = parseInt(feed.time) > nodes[feed.tag].lastupdate ? parseInt(feed.time) : nodes[feed.tag].lastupdate
        nodes[feed.tag].feeds.push(feed)
        // @todo: set node.status to [success,warning,danger] dependant on feed interval and feed last_update time
        // console.log((new Date().valueOf() / 1000) - nodes[feed.tag].lastupdate)

        if ((new Date().valueOf() / 1000) - nodes[feed.tag].lastupdate < 1000) {
          nodes[feed.tag].status = 'warning'
        }
      })
      this.nodes = Object.values(nodes)
      console.log('parsed data', JSON.parse(JSON.stringify(Object.values(nodes))))
    },
    getFeedData: function () {
      let apikey = this.$parent.apikey
      if (!apikey) return false
      this.errors = []
      this.connect()
    }
  },
  watch: {
    apikey: function (val) {
      this.getFeedData()
    },
    autoreload: function (val) {
      if (!val) {
        if (this.autoreloadInterval) window.clearInterval(this.autoreloadInterval)
      } else {
        this.connect()
        let that = this
        this.autoreloadInterval = window.setTimeout(function () {
          that.connect()
        }, this.autoreloadDelay)
      }
    }
  },
  mounted () {
    if (!this.getFeedData()) {
      // data not available
      let that = this
      setTimeout(function () {
        that.getFeedData()
      }, 500)
    }
    this.autoreload = false

    this.mqtt = require('mqtt')

    /*
    this.$nextTick(() => {
      let $ = global.$
      $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
      })

      // add data-clicked="true" once popover shown
      $('body').on('show.bs.popover', '[data-toggle="popover"]', function () {
        this.dataset.clicked = 'true'
      })
      // remove data-clicked="true" once popover hidden
      $('body').on('hide.bs.popover', '[data-toggle="popover"]', function () {
        this.dataset.clicked = 'false'
      })
      // only allow one visible popover
      $('[data-toggle="popover"]').on('click', function (event) {
        if ('INPUT|LABEL'.split('|').indexOf(event.target.tagName) > -1) {
          let input = event.target.tagName === 'INPUT' ? event.target : document.getElementById(event.target.getAttribute('for'))
          let state = input.checked === true
          input.checked = !state
          $(input).trigger('change')
          event.stopPropagation()
        }
        $('[data-toggle="popover"]').not(this).popover('hide')
      })
      // hide popovers when accordion hidden
      $('.accordion').on('hide.bs.collapse', function () {
        $(this).find('[data-toggle="popover"]').popover('hide')
      })
      // only show the graph on second click
      // this allows popover to be visible for mobiles
      $('body').on('click', '[data-toggle="popover"]', function (event) {
        if (this.dataset.clicked === 'true') {
          event.preventDefault()
        } else {
          alert('DEMO. Not going to graph page...')
        }
      })
      $('body').on('click', '[data-action="close.popover"]', function () {
        console.log('close', $(this).parents())
        $(this).tooltip('hide').parents('.popover').popover('hide')
      })
    })
*/
  }
}

</script>
