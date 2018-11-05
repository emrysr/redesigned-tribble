<template>
    <form class="form-inline my-2 my-lg-0">
        <div class="form-group">
            <small class="form-text text-light pr-2">{{ $t('message.apikey') }}</small>
            <input type="text" v-model="local_api_key" :title="$t('message.apikey')" class="form-control" :placeholder="$t('message.help')" :aria-label="$t('message.apikey')" aria-describedby="">
        </div>
    </form>
</template>

<script>

export default {
  name: 'ApiKey',
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: {
        message: {
          apikey: 'API Key',
          help: 'Get your API key from your account page'
        }
      },
      cy: {
        message: {
          apikey: 'Tocyn dilysu',
          help: 'gallwch gael eich allwedd API o\'ch tudalen cyfrif'
        }
      }
    }
  },
  data: function () {
    return {
      local_api_key: process.env.API_KEY
    }
  },
  watch: {
    local_api_key (newKey) {
      // process.env.API_KEY = newKey
      console.log('apikey change')
    }
  }
}
</script>
