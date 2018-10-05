<template>
<div>

  <section>
    <h1 class="display-4 d-sm-flex justify-content-between align-items-end">
      {{ $t("message.feeds") }}:
      <FeedlistToolbar :nodes="nodes"/>
    </h1>
  </section>

  <div class="accordion">
    <Node
      v-for="node in nodes"
      v-bind:key="node.name"
      v-bind:node="node"
    ></Node>
  </div>

  <div class="alert alert-danger" v-for="error in errors" v-bind:key="error">{{ error }}</div class="alert alert-danger">
  <button v-if="errors.length>0" @click="getFeedData()" class="btn btn-lg btn-primary">Retry</button>
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
      this.errors = []
      let that = this
      axios
        .get('http://bde391cd.ngrok.io/emoncms/feed/list.json', {
          params: {
            apikey: 'cb9579be83678b89a5eb0faea08ad839'
          }
        })
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
          that.errors.push(error.response || 'Error in connecting to your local emonCMS')

          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            that.errors.push(error.response.data)
            that.errors.push(error.response.status)
            that.errors.push(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            that.errors.push(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            that.errors.push('Error', error.message)
          }
          that.errors.push(error.config)
      })
    }
  },
  mounted () {
    this.getFeedData()
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
