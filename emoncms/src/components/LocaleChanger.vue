<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale" class="form-control">
      <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'LocaleChanger',
  data () {
    return { langs: ['en', 'cy', 'es', 'fr'] }
  },
  computed: {
    // created local computed value to watch for changes. bootstrap tooltip() can then be re-built on change
    lang: function () {
      return this.$i18n.locale
    }
  },
  watch: {
    lang: function (val) {
      global.$('[data-toggle="tooltip"]').tooltip('dispose')
    }
  }
}
</script>
