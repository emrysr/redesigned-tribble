<template>
  <li class="list-group-item w-100 d-flex justify-content-between text-body"
    data-toggle="popover"
    :title="feed.name"
    data-content2='<FeedTooltip/>'
    data-content='abcdef'
    >
    <div class="d-flex justify-content-between align-items-start col-sm-7 col-md-5 pl-2 pr-3">
      <div class="row no-gutters col-5">
        <div class="col-2 custom-control custom-checkbox">
          <input :id="'select-feed-' + feed.id" class="custom-control-input" type="checkbox" value="option1" aria-label="...">
          <label :for="'select-feed-' + feed.id" class="custom-control-label position-absolute"></label>
        </div>
        <span class="col-10 text-truncate d-inline-block">{{feed.name}}</span>
      </div>
      <span class="d-none d-md-inline-block col-1">
        <Icon v-bind:icon="privateIcon"/>
      </span>
      <span class="d-none d-lg-inline-block col-3 text-truncate">{{feed.engine}}</span>
      <span>{{ prettySize(feed.time) }}</span>
    </div>
    <div class="pr-3">
      <span>{{ relativeTime(feed.time) }}</span>
    </div>
  </li>
</template>

<script>
import Icon from '@/components/Icon'
import pretty from 'prettysize'
import moment from 'moment'

export default {
  components: {
    'Icon': Icon
  },
  computed: {
    privateIcon: function () {
      return this.feed.private ? 'lock-locked' : 'lock-unlocked'
    },
    prettySize: function () {
      return function (size) {
        return pretty(size)
      }
    },
    relativeTime: function () {
      return function (time) {
        return !time ? 'n/a' : moment.unix(time).fromNow()
      }
    }
  },
  props: ['feed', 'node'],
  name: 'NodeItem',
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
