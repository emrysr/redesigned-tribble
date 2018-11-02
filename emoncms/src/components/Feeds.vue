<template>
<div>

  <section>
    <div class="display-4 d-sm-flex justify-content-between align-items-end">
      <div>
        {{ $t("message.feeds") }}:
        <div class="btn-group" role="status">
          <button class="btn" :class="{active: app.mqtt.connected, 'btn-outline-success': app.mqtt.connected, 'btn-outline-secondary': !app.mqtt.connected}" @click="disconnect()">
            {{ !app.mqtt.connected ? 'Connecting&hellip;' : 'Connected' }}
          </button>
          <input id="autorefresh" class="form-check-input invisible" type="checkbox" v-model="autoreload" autocomplete="off">
          <label for="autorefresh" class="btn btn-outline-primary mb-0" :class="{active: autoreload}" style="font-size: 1rem" :title="'Loaded content '+counter+' times @ '+(autoreloadDelay/1000)+'s intervals'">
            Live ({{ autoreload  ? 'on': 'off' }})
          </label>
        </div>
      </div>

      <transition name="fade" v-if="localApiKey.length > 0 && errors.length==0">
        <FeedlistToolbar v-if="nodes.length>0" :nodes="nodes"/>
      </transition>
    </div>
  </section>

  <div v-if="localApiKey.length == 0" class="alert alert-warning">
    <h4>Empty API key</h4>
    Please enter in your API key. Your API key is found on your <a href="http://localhost/emoncms/user/view" title="emoncms user account page" target="_blank">account page</a>.
  </div>
  <div v-else>
    <div class="alert alert-danger" v-for="error in errors" v-bind:key="error">{{ error }}</div>
    <button v-if="errors.length>0" @click="getFeedData()" class="btn btn-lg btn-primary">Retry</button>
  </div>
  <div id="feedlist" v-if="localApiKey.length > 0 && errors.length==0" name="bounce">
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
import jsonSize from 'json-size'

export default {
  name: 'Feeds',
  components: {
    'FeedlistToolbar': FeedlistToolbar,
    'FeedTooltip': FeedTooltip,
    'Node': Node
  },
  props: ['app'],
  data () {
    return {
      msg: 'Feeds List',
      response: null,
      nodes: {},
      errors: [],
      autoreload: false,
      autoreloadDelay: 5000,
      autoreloadInterval: null,
      status: [],
      counter: 0,
      localApiKey: this.app.apikey,
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
      }
    }
  },
  computed: {
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
      if (!this.app.mqtt.client) throw new Error('mqtt client not initialized')
      this.app.mqtt.client.on('connect', this.onConnect)
      this.app.mqtt.client.on('message', this.onMessage)
    },
    publish: function () {
      if (!this.app.mqtt.connected) {
        this.connect()
      } else {
        var command = process.env.ROOT_API + '/feed/list.json&apikey=' + this.localApiKey
        this.app.mqtt.client.publish(this.app.mqtt.pubTopic, command)
        this.app.mqtt.status.push('publishing ' + command + ' to ' + this.app.mqtt.pubTopic)
        this.app.mqtt.connected = true
      }
    },
    subscribe: function () {
      if (!this.app.mqtt.connected) {
        this.connect()
      } else {
        this.app.mqtt.client.subscribe(this.app.mqtt.subTopic)
      }
    },
    disconnect: function () {
      // @todo: this should unsubscribe and disconnect from subClient & pubClient
      let that = this
      let options = {
        onSuccess: function () {
          that.app.mqtt.subscribed = false
        }
      }
      this.app.mqtt.client.unsubscribe(this.app.mqtt.pubTopic, options)
      this.app.mqtt.client.disconnect()
      this.app.mqtt.disconnect()
    },
    onConnect: function (connack) {
      this.app.mqtt.status.push('connected to broker', connack)
      if (connack.returnCode > 0) {
        this.app.mqtt.status.push('unable to connect to: ' + this.app.mqtt.pubTopic)
        this.app.mqtt.connected = false
      } else {
        this.app.mqtt.connected = true
        this.subscribe()
        this.publish()
      }
    },
    onDisconnect: function (connack) {
      this.app.mqtt.status.push('disconnect callback', connack)
      if (connack.returnCode > 0) {
        this.app.mqtt.status.push('unable to disconnect to: ' + this.app.mqtt.pubTopic)
        this.app.mqtt.connected = true
      } else {
        this.app.mqtt.connected = false
      }
    },
    onMessage: function (topic, message) {
      this.app.mqtt.status.push('data received from: " ' + topic + '" (' + Number(jsonSize(message) / 1024).toFixed(2) + 'KB)')
      this.processData(JSON.parse(message.toString()))
    },
    isSelected: function (feedId) {
      for (let i in this.nodes) {
        let node = this.nodes[i]

        for (let j in node.feeds) {
          let feed = node.feeds[j]
          if (feed.id === feedId) {
            return typeof this.nodes[i].feeds[j].selected === 'undefined' ? false : this.nodes[i].feeds[j].selected === true
          }
        }
      }
      // default to collapsed is true
      return false
    },
    isCollapsed: function (tag) {
      for (let key in this.nodes) {
        let node = this.nodes[key]
        if (node.tag === tag) {
          return typeof this.nodes[key].collapsed === 'undefined' ? true : this.nodes[key].collapsed === true
        }
      }
      // default to collapsed is true
      return true
    },
    processData: function (data) {
      var nodes = {}
      for (let key in data) {
        let feed = data[key]
        // create array of nodes with array of feeds as a property of each node
        feed.engine_name = this.getEngineName(feed.engine)
        feed.selected = this.isSelected(feed.id)

        if (!nodes[feed.tag]) {
          nodes[feed.tag] = {
            tag: feed.tag,
            id: camelCase(feed.tag),
            collapsed: this.isCollapsed(feed.tag),
            size: 0,
            lastupdate: 0,
            feeds: [],
            status: 'warning'
          }
        }

        nodes[feed.tag].size += parseInt(feed.size)
        nodes[feed.tag].lastupdate = parseInt(feed.time) > nodes[feed.tag].lastupdate ? parseInt(feed.time) : nodes[feed.tag].lastupdate

        nodes[feed.tag].feeds.push(feed)
        // @todo: set node.status to [success,warning,danger] dependant on feed interval and feed last_update time
        // console.log((new Date().valueOf() / 1000) - nodes[feed.tag].lastupdate)

        if ((new Date().valueOf() / 1000) - nodes[feed.tag].lastupdate < 400) {
          nodes[feed.tag].status = 'success'
        }
        if ((new Date().valueOf() / 1000) - nodes[feed.tag].lastupdate > 10000) {
          nodes[feed.tag].status = 'danger'
        }
      }
      this.nodes = Object.values(nodes)
      this.counter++
      // this.status.push('parsed data', JSON.parse(JSON.stringify(Object.values(nodes))))
    },
    getFeedData: function () {
      if (!this.app.apikey) throw new Error('apikey not available')
      this.errors = []
      // start it all off by sending the request to the mqtt server
      this.publish()
    }
  },
  watch: {
    apikey: function (val) {
      this.app.apikey = val
      this.getFeedData()
    },
    autoreload: function (val) {
      window.clearInterval(this.autoreloadInterval)
      if (!val) {
        // this.status.push('auto reload OFF')
      } else {
        // this.status.push('auto reload ON')
        this.publish()
        let that = this
        this.autoreloadInterval = window.setInterval(function () {
          // this.status.push('auto-reloading...')
          that.publish()
        }, this.autoreloadDelay)
      }
    }
  },
  mounted () {
    if (!this.getFeedData()) {
      // data not available - wait before retry
      let that = this
      setTimeout(function () {
        that.getFeedData()
      }, 500)
    }

    /*
    // collapsable bs events
    this.$nextTick(() => {
      let $ = global.$
      $('#feedlist').on('hidden.bs.collapse', function () {

      })
    })
    */
    /*
    TOOLTIP CODE
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
