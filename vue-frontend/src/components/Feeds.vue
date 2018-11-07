<template>
<div>

  <section>
    <div class="display-4 d-sm-flex justify-content-between align-items-end">
      <div>
        {{ $t("message.feeds") }}:
        <input id="autorefresh" class="form-check-input invisible" type="checkbox" v-model="autoreload" autocomplete="off">
        <label for="autorefresh" class="btn btn-outline-primary mb-0" :class="{active: autoreload}" style="font-size: 1rem" :title="'Loaded content '+counter+' times @ '+(autoreloadDelay/1000)+'s intervals'">
          Live ({{ autoreload  ? 'on': 'off' }})
        </label>
      </div>

      <transition name="fade" v-if="errors.length==0">
        <FeedlistToolbar v-if="nodes.length>0" :nodes="nodes"/>
      </transition>
    </div>
  </section>
  <div v-if="errors.length > 0">
    <div class="alert alert-danger" v-for="error in errors" v-bind:key="error">{{ error }}</div>
    <button v-if="errors.length>0" @click="getFeedData()" class="btn btn-lg btn-primary">Retry</button>
  </div>
  <div v-else id="feedlist" name="bounce">
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
      counter: 0,
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
    },
    username: function () {
      return this.$root.$data.auth.user.username || JSON.parse(localStorage.getItem('user')).username
    },
    pubTopic: function () {
      return `user/${this.username}/response`
    },
    subTopic: function () {
      return `user/${this.username}/request`
    },
    status: {
      get: function () {
        return this.$root.$data.mqtt.status
      },
      set: function (newVal) {
        this.$root.$data.mqtt.status.push(JSON.stringify(newVal))
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
    publish: function () {
      if (this.$root.$data.mqtt.connected) {
        let params = {
          port: 80
        }
        this.$root.$data.mqtt.client.publish(this.pubTopic, params)
        this.$root.$data.mqtt.status.push('publishing ' + JSON.stringify(params) + ' to ' + this.pubTopic)
        this.$root.$data.mqtt.connected = true
      }
    },
    subscribe: function () {
      if (this.$root.$data.mqtt.connected) {
        this.$root.$data.mqtt.status.push(`subscribing to topic: user/${this.$root.$data.auth.user.username}/response`)
        this.$root.$data.mqtt.client.subscribe(`user/${this.$root.$data.auth.user.username}/response`)
      }
    },
    disconnect: function () {
      // @todo: this should unsubscribe and disconnect from subClient & pubClient
      let that = this
      var options = {
        onSuccess: function () {
          that.$root.$data.mqtt.subscribed = false
        }
      }
      if (this.$root.$data.mqtt.client) {
        this.$root.$data.mqtt.client.unsubscribe(this.$root.$data.mqtt.pubTopic, options)
        this.$root.$data.mqtt.client.disconnect()
        this.$root.$data.mqtt.disconnect()
      }
    },
    onConnect: function (connack) {
      this.$root.$data.mqtt.connected = true
      this.$root.$data.mqtt.status.push('connected to broker', connack)
      if (connack.returnCode > 0) {
        this.$root.$data.mqtt.status.push('unable to connect to: ' + this.$root.$data.mqtt.pubTopic)
        this.$root.$data.mqtt.connected = false
      } else {
        this.$root.$data.mqtt.connected = true
        this.subscribe()
        this.publish()
      }
    },
    onDisconnect: function (connack) {
      this.$root.$data.mqtt.status.push('disconnect callback', connack)
      if (connack.returnCode > 0) {
        this.$root.$data.mqtt.status.push('unable to disconnect to: ' + this.$root.$data.mqtt.pubTopic)
        this.$root.$data.mqtt.connected = true
      } else {
        this.$root.$data.mqtt.connected = false
      }
    },
    onMessage: function (topic, message) {
      this.$root.$data.mqtt.status.push('data received from: " ' + topic + '" (' + Number(jsonSize(message) / 1024).toFixed(2) + 'KB)')
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
      this.errors = []
      // start it all off by sending the request to the mqtt server
      if (!this.$root.$data.mqtt.subscribed) {
        this.mqtt_connect()
      } else {
        this.publish()
      }
    }
  },
  watch: {
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
