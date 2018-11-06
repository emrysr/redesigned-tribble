<template>
    <span class="d-flex justify-content-between">
        <a href="#" class="nav-link" @click="flipLang(lang, $event)" :class="{'active':lang==$i18n.locale}" v-for="(lang, i) in langs" :key="`Lang${i}`">{{ lang }}</a>
    </span>
</template>

<script>
export default {
  name: 'LocaleChanger',
  props: ['app'],
  data () {
    return { langs: ['en', 'cy', 'es', 'fr'] }
  },
  methods: {
    flipLang: function (lang, event) {
      event.preventDefault()
      this.$i18n.locale = lang
    }
  }
  // ,
  // computed: {
  //   lang: function () {
  //     return this.$i18n.locale
  //   }
  // },
  // watch: {
  //   lang: function (val) {
  //     localStorage.setItem('lang', val)
  //     this.app.lang = val
  //   }
  // }
}
</script>
