<!-- used as the base component to 'save-as' a new component -->
<template>
  <h1 class="hello">{{ $t('message.welcome') }} {{ msg }}</h1>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: ' to Your Vue.js App'
    }
  },
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: { message: {
        welcome: 'Welcome'
      }
      },
      cy: { message: {
        welcome: 'Croeso'
      }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      global.$('.hello').hide().fadeIn('slow')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
