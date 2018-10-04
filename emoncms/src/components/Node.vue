<template>
  <div class="card dropup">
    <div class="card-header" :id="'heading' + node.id">
      <a href="#"
        :class="'btn btn-link btn-block dropdown-toggle' + (node.collapsed ? ' collapsed' : '')"
        data-toggle="collapse"
        :data-target="'#collapse' + node.id"
        :aria-controls="'collapse' + node.id"
        :aria-expanded="node.collapsed"
      >
        <div class="w-100 d-flex justify-content-between">
          <div class="d-flex justify-content-between col-sm-7 col-md-5">
            <h5 class="mb-0">{{node.tag}}:</h5>
            <span>{{ nodeMaxSize(node) }}</span>
          </div>
          <span>{{ nodeLastUpdate(node) }}</span>
        </div>
      </a>
    </div>

    <div
      :id="'collapse' + node.id"
      :class="'collapse' + (!node.collapsed ? ' show' : '')" :aria-labelledby="'heading' + node.id"
    >
      <ul class="list-group list-group-flush">
        <NodeItem v-for="feed in node.feeds"
          v-bind:key="feed.id"
          v-bind:node="node"
          v-bind:feed="feed">
        </NodeItem>
      </ul><!-- /.list-group -->
    </div><!-- /.collapse -->
  </div><!-- /.card -->
</template>

<script>
import NodeItem from '@/components/NodeItem'
import pretty from 'prettysize'
import moment from 'moment'

export default {
  name: 'Node',
  components: {
    'NodeItem': NodeItem
  },
  props: ['node'],
  computed: {
    nodeMaxSize: function () {
      return function (node) {
        var size = 0
        node.feeds.forEach(function (feed) {
          size += parseInt(feed.size)
        })
        return pretty(size)
      }
    },
    nodeLastUpdate: function () {
      return function (node) {
        let max = 0
        node.feeds.forEach(function (item) {
          max = parseInt(item.time) > max ? parseInt(item.time) : max
        })
        return !max ? 'n/a' : moment.unix(max).fromNow()
      }
    }
  }
}
</script>

<style>
  .accordion .card .btn{color:inherit}
  .accordion .card .list-group-item[data-clicked="true"]{
    background: #bee5eb!important;
    color: #212529!important;
  }
  .accordion .dropdown-toggle:after{
    margin-top:.5em;
    position:absolute;
    left: 1em;
    top: 1.5em;
  }
  .accordion .list-group-item{
    cursor: pointer
  }
  .accordion .card:last-child .list-group-item:last-child{
    border-bottom:1px solid #FAFAFA
  }
</style>
