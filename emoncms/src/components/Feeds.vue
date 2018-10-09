<template>
<div>

  <section>
    <h1 class="display-4 d-sm-flex justify-content-between align-items-end">
      {{ $t("message.feeds") }}:
      <transition name="fade" v-if="$parent.apikey.length > 0 && errors.length==0">
        <FeedlistToolbar v-if="nodes.length>0" :nodes="nodes"/>
      </transition>
    </h1>
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
import axios from 'axios'
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
    getFeedData: function () {
      let apikey = this.$parent.apikey
      if (!apikey) return false
      this.errors = []
      let that = this
      // @TODO: use OAuth 2.0, CORS suppored Authorization Header for remote api calls
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$parent.apikey
      // add these to the API server response headers for the CORS response to work.
      // ```php
      //  header('Access-Control-Allow-Origin: *');
      //  header('Access-Control-Allow-Headers: Authorization');
      //  header('Access-Control-Allow-Methods: GET');
      // ```

      // @TODO: remove this default parameter as it bypasses the CORS Authorization
      axios.defaults.params = {}
      // axios.defaults.params['apikey'] = `${this.$parent.apikey}`
      // https://github.com/emoncms/emoncms/pull/1061
      axios
        .get('http://localhost:80/emoncms/feed/list.json')
        .then(function (response) {
          var nodes = {}
          response.data.forEach(function (feed) {
            // create array of nodes with array of feeds as a property of each node
            feed.engine_name = that.getEngineName(feed.engine)
            feed.selected = false
            if (!nodes[feed.tag]) {
              nodes[feed.tag] = {
                tag: feed.tag,
                id: camelCase(feed.tag),
                collapsed: false,
                size: 0,
                lastupdate: 0,
                feeds: []
              }
            }
            nodes[feed.tag].size += parseInt(feed.size)
            nodes[feed.tag].lastupdate = parseInt(feed.time) > nodes[feed.tag].lastupdate ? parseInt(feed.time) : nodes[feed.tag].lastupdate
            nodes[feed.tag].feeds.push(feed)
          })
          that.nodes = Object.values(nodes)
          // console.log(JSON.parse(JSON.stringify(Object.values(nodes))))
        })
        .catch(function (error) {
          // that.errors.push(error.response || 'Error in connecting to your local emonCMS')

          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            that.errors.push(error.response.data)
            that.errors.push(error.response.status)
            // that.errors.push(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // that.errors.push(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            that.errors.push('Error', error.message)
          }
          // that.errors.push(error.config)
        })
    }
  },
  watch: {
    apikey: function (val) {
      this.getFeedData()
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

var mqtt = require('mqtt')
var client = mqtt.connect('ws://mqtt.emrys.cymru:8080')
var subTopic = 'response'
var pubTopic = 'request'

client.on('connect', function () {
  client.subscribe(subTopic, function (err) {
    if (!err) {
      client.publish(pubTopic, 'GET /emoncms/feed/list.json HTTP/1.1')
    }
    // http://localhost:80/emoncms/feed/list.json&apikey=cb9579be83678b89a5eb0faea08ad839
  })
})

client.on('message', function (topic, message) {
  console.log(topic, '=', message.toString())
  client.end()
})
</script>
