<template>
  <li class="list-group-item pl-0"
    data-toggle="popover"
    :title="feed.name"
    data-content2='<FeedTooltip/>'
    data-content='abcdef'
    >
    <div class="row">
      <div class="col col-sm-6 col-md-4 col-lg-3 row no-gutters">
        <div class="custom-control custom-checkbox">
          <input :id="'select-feed-' + feed.id" class="custom-control-input" type="checkbox" value="option1" aria-label="...">
          <label :for="'select-feed-' + feed.id" class="custom-control-label position-absolute"></label>
        </div>
        <div class="text-truncate d-inline-block pl-3">{{feed.name}}</div>
      </div>

      <div class="d-none d-md-block px-1"><Icon v-bind:icon="privateIcon"/></div>
      <div class="col-2 d-none d-lg-inline-block text-truncate">{{feed.engine_name}}</div>
      <div class="col-sm-3 px-sm-2 px-md-4 d-none d-sm-block">{{ feed.size | prettySize }}</div>
      <div class="col-sm-3 d-none d-sm-block text-truncate ml-auto text-right">{{ feed.time | relativeTime }}</div>
    </div>
  </li>
</template>

<script>
import Icon from '@/components/Icon'
import pretty from 'prettysize'
import moment from 'moment'

export default {
  name: 'NodeItem',
  props: ['feed', 'node'],
  components: {
    'Icon': Icon
  },
  computed: {
    privateIcon: function () {
      return this.feed.ispublic ? 'lock-unlocked' : 'lock-locked'
    }
  },
  filters: {
    relativeTime (time) {
      return !time ? 'n/a' : moment.unix(time).fromNow()
    },
    prettySize (bytes) {
      return pretty(bytes)
    }
  },
  mounted () {
    this.$nextTick(() => {
      let $ = global.$
      // show more detail in the popover
      $('body').popover({
        selector: '[data-toggle="popover"]',
        placement: 'top',
        html: true
        // template: '<FeedTooltip/>'
      })
    })
  }
}
</script>

<style scoped>
.list-group-item{overflow:hidden}
.custom-control-label::after,
.custom-control-label::before{
  margin-left:.75em;
}
</style>