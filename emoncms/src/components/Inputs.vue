<template>
  <h1 class="display-4">
    {{ $t("message.inputs") }}:
  </h1>
</template>

<script>
export default {
  name: 'Feeds',
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: { message: {
        inputs: 'Inputs'
      }
      },
      cy: { message: {
        inputs: 'Mewnlifau'
      }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
