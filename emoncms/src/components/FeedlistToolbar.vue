<template>
    <span class="btn-toolbar d-flex justify-content-end" role="toolbar" aria-label="feed buttons">
      <span class="btn-group mt-1 btn-group-lg" role="group" aria-label="Basic example">
        <button type="button"
          @click="collapseAll" id="collapse-all"
          class="btn btn-outline-primary"
          :title="$t('message.collapse_help')"
          data-toggle="tooltip"
        >
          {{ oneCollapsed || !allExpanded ? $t('message.collapse') : $t('message.expand') }}
        </button>
        <button type="button"
          @click="selectAll"
          id="select-all"
          class="btn btn-outline-primary"
          :title="$t('message.selectall_help')"
          data-toggle="tooltip"
        >
          {{ (selected>0 ? '('+selected+') ': '') + (allSelected ? $t('message.deSelectAll') : $t('message.selectAll')) }}
        </button>
      </span>
      <span id="feed-action-buttons" class="btn-group ml-1 mt-1" role="group" aria-label="Feed Specific actions">
        <button type="button" class="btn" :class="{'btn-info':oneSelected}" :disabled="!oneSelected" title="Edit selected feeds" data-toggle="tooltip"><Icon icon="edit" /></button>
        <button type="button" class="btn" :class="{'btn-info':oneSelected}" :disabled="!oneSelected" title="Delete selected feeds" data-toggle="tooltip"><Icon icon="delete" /></button>
        <button type="button" class="btn" :class="{'btn-info':oneSelected}" :disabled="!oneSelected" title="Download selected feeds" data-toggle="tooltip"><Icon icon="download" /></button>
        <button type="button" class="btn" :class="{'btn-info':oneSelected}" :disabled="!oneSelected" title="View Selected feeds as a graph" data-toggle="tooltip"><Icon icon="view" /></button>
      </span>
    </span>
</template>

<script>
import Icon from '@/components/Icon'

export default {
  name: 'FeedlistToolbar',
  props: ['nodes'],
  components: {
    'Icon': Icon
  },
  data () {
    return {
      // abc
    }
  },
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: { message: {
        collapse_help: 'Show/Hide all feeds',
        selectall_help: 'Select/Unselect all feeds',
        selectAll: 'Select All',
        deSelectAll: 'Unselect All',
        expand: 'Expand',
        collapse: 'Collapse'
      }
      },
      cy: { message: {
        collapse_help: 'Dangos/Cuddio pôb ffrwd gan newid maint y node',
        selectall_help: 'Dewiwch neu dad ddewiswch pôb ffrwd cyn gwenud gwaith arnom',
        selectAll: 'Dewis pôb un',
        deSelectAll: 'Dad-ddewis pôb un',
        expand: 'Agor',
        collapse: 'Cau'
      }
      }
    }
  },
  computed: {
    allCollapsed: function () {
      if (this.nodes) {
        for (let node in this.nodes) {
          if (!this.nodes[node].collapsed) return false
        }
      }
      return true
    },
    oneCollapsed: function () {
      if (this.nodes) {
        for (let node in this.nodes) {
          if (!this.nodes[node].collapsed) return true
        }
      }
      return false
    },
    allExpanded: function () {
      if (this.nodes) {
        for (let node in this.nodes) {
          if (!this.nodes[node].collapsed) return false
        }
      }
      return true
    },
    allSelected: function () {
      if (this.nodes) {
        for (let node in this.nodes) {
          for (let feed in this.nodes[node].feeds) {
            if (!this.nodes[node].feeds[feed].selected) return false
          }
        }
      }
      return true
    },
    oneSelected: function () {
      if (this.nodes) {
        for (let node in this.nodes) {
          for (let feed in this.nodes[node].feeds) {
            if (this.nodes[node].feeds[feed].selected) return true
          }
        }
      }
      return false
    },
    selected: function () {
      let total = 0
      if (this.nodes) {
        for (let node in this.nodes) {
          for (let feed in this.nodes[node].feeds) {
            if (this.nodes[node].feeds[feed].selected) total++
          }
        }
      }
      return total
    }
  },
  methods: {
    collapseAll: function (event) {
      // this.oneCollapsed || !this.allExpanded || this.allCollapsed
      let collapseAllAction = !this.allExpanded
      for (let node in this.nodes) {
        this.nodes[node].collapsed = collapseAllAction
      }
    },
    selectAll: function (event) {
      let selectAllAction = !this.allSelected
      for (let node in this.nodes) {
        for (let feed in this.nodes[node].feeds) {
          this.nodes[node].feeds[feed].selected = selectAllAction
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let $ = global.$
      $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
      })
    })
  }
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
