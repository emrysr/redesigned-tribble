<template>
  <li class="list-group-item pl-0"
    :title="feed.name"
    :class="{'bg-info': feed.selected,'text-light': feed.selected}"
    data-toggle="popover"
    data-content2='<FeedTooltip/>'
    data-content='abcdef'
    >
    <div class="row">
      <div class="col col-sm-6 col-md-4 col-lg-3 row no-gutters">
        <div class="custom-control custom-checkbox">
          <input :id="'select-feed-' + feed.id" class="custom-control-input" type="checkbox" v-model="feed.selected" aria-label="...">
          <label :for="'select-feed-' + feed.id" class="custom-control-label position-absolute"></label>
        </div>
        <div class="text-truncate d-inline-block pl-3">{{feed.name}}</div>
      </div>

      <div class="d-none d-md-block px-1"><Icon v-bind:icon="privateIcon"/></div>
      <div class="col-2 d-none d-lg-inline-block text-truncate">{{feed.engine_name}}</div>
      <div class="col-sm-3 px-sm-2 px-md-4 px-lg-4_5 d-none d-sm-block">{{ feed.size | prettySize }}</div>
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
.custom-control-label::before{ margin-left:.75em; }
.px-lg-4_5 { padding-left: .8rem!important}
@media only screen and (min-width: 768px) {
  .px-lg-4_5 { padding-left: 2rem!important}
}
@media only screen and (min-width: 992px) {
  .px-lg-4_5 { padding-left: 1.88rem!important}
}
</style>
