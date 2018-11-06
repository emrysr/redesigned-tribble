<template>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ this.$i18n.locale }}
      </a>
      <div class="dropdown-menu dropdown-menu-right">
        <a class="dropdown-item" @click="$i18n.locale=lang" :class="{'active':lang==$i18n.locale}" v-for="(lang, i) in langs" :key="`Lang${i}`">{{ lang }}</a>
      </div>
    </li>
</template>

<script>
export default {
  name: 'LocaleChanger',
  props: ['app'],
  data () {
    return { langs: ['en', 'cy', 'es', 'fr'] }
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
  //     this.store.lang = val
  //   }
  // }
}
</script>
