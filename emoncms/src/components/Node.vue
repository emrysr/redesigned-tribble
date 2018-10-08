<template>
  <div class="card dropup">
    <div class="card-header p-0" :id="'heading' + node.id">
      <!-- @todo: check if any feed within the node is selected, OPEN ACCORDION IF CONTAINED ITEM IS SELECTED-->
      <a href="#"
        :class="'dropdown-toggle text-body py-3 pl-4 pr-3 row' + (node.collapsed ? ' collapsed' : '')"
        data-toggle="collapse"
        :data-target="'#collapse_' + node.id"
        :aria-controls="'collapse_' + node.id"
        :aria-expanded="node.collapsed"
        @click="node.collapsed = !node.collapsed"
      >
        <h5 class="col col-sm-5 col-md-4 col-lg-5 mb-0 ml-3 ml-sm-4">{{node.tag}}:</h5>
        <div class="col-sm-3 d-none d-sm-block">{{ node.size | prettySize }}</div>
        <div class="col-sm-3 d-none d-sm-block text-right ml-auto text-truncate">{{ node.lastupdate | relativeTime }}</div>
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
  filters: {
    relativeTime (time) {
      return !time ? 'n/a' : moment.unix(time).fromNow()
    },
    prettySize (bytes) {
      return pretty(bytes)
    }
  }
}
</script>

<style scoped>
  .card .card-header{overflow:hidden}
  .card .a{color:inherit}
  .card .list-group-item[data-clicked="true"]{
    background: #bee5eb!important;
    color: #212529!important;
  }
  .dropdown-toggle:after{
    margin-top:.5em;
    position:absolute;
    left: .8em;
    top: 1em;
    transition: all .4s ease-in-out
  }
  .list-group-item{
    cursor: pointer
  }
  .dropdown-toggle.collapsed:after{
    transform: rotateX(180deg);
  }
</style>
