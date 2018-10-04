
<template>
  <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
    <router-link v-for="routes in links"
    v-bind:key="routes.id" tag="li"
    class="nav-item" :to="`${routes.page}`">
    <a :href="routes.page" class="nav-link">{{$t('message.'+routes.title)}}</a>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: 'Nav',
  data: function () {
    return {
      links: [
        {id: 1, page: '/feeds', title: 'feeds'},
        {id: 2, page: '/inputs', title: 'inputs'}
      ]
    }
  },
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      en: { message: { feeds: 'Feeds', inputs: 'Inputs' } },
      cy: { message: { feeds: 'Ffrwdau', inputs: 'Mewnlifau' } }
    }
  }
}
</script>
