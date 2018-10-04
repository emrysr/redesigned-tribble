<template>
    <span class="btn-toolbar d-flex justify-content-end" role="toolbar" aria-label="feed buttons">
      <span class="btn-group mt-1 btn-group-lg" role="group" aria-label="Basic example">
        <button type="button" @click="collapseAll" id="collapse-all" class="btn btn-outline-primary" :title="$t('message.collapse_help')" data-toggle="tooltip">{{ allExpanded ? $t('message.collapse') : $t('message.expand') }}</button>
        <button type="button" @click="selectAll" id="select-all" class="btn btn-outline-primary" :title="$t('message.selectall_help')" data-toggle="tooltip">{{ $t('message.selectAll') }}</button>
      </span>
      <span id="feed-action-buttons" class="btn-group ml-1 mt-1" role="group" aria-label="Feed Specific actions">
        <button type="button" class="btn btn-outline-primary" disabled title="Edit selected feeds" data-toggle="tooltip"><Icon icon="edit" /></button>
        <button type="button" class="btn btn-outline-primary" disabled title="Delete selected feeds" data-toggle="tooltip"><Icon icon="delete" /></button>
        <button type="button" class="btn btn-outline-primary" disabled title="Download selected feeds" data-toggle="tooltip"><Icon icon="download" /></button>
        <button type="button" class="btn btn-outline-primary" disabled title="View Selected feeds as a graph" data-toggle="tooltip"><Icon icon="view" /></button>
      </span>
    </span>
</template>

<script>
import Icon from '@/components/Icon'

export default {
  name: 'FeedlistToolbar',
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
        collapse: 'Collapse'
      }
      },
      cy: { message: {
        collapse_help: 'Dangos/Cuddio pôb ffrwd gan newid maint y node',
        selectall_help: 'Dewiwch neu dad ddewiswch pôb ffrwd cyn gwenud gwaith arnom',
        selectAll: 'Dewis pôb un',
        collapse: 'Cau'
      }
      }
    }
  },
  computed: {
    allExpanded: function () {
      console.log('allExpanded')
      return true
    }
  },
  methods: {
    collapseAll: function (event) {
      console.log('collapseAll()', event.type)
    },
    selectAll: function (event) {
      console.log('selectAll()', event.type)
    }
  }
}
</script>
