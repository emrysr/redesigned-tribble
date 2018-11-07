
<template>
  <div class="collapse navbar-collapse" id="mainNavbarToggler">
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
      <router-link v-for="routes in links"
      v-bind:key="routes.id" tag="li"
      class="nav-item" :to="`${routes.page}`">
      <a :href="routes.page" class="nav-link">{{$t('message.'+routes.title)}}</a>
      </router-link>
    </ul>
    <ul class="navbar-nav">
      <li class="nav-item">
        <LocaleList />
      </li>
      <li v-if="this.auth.user" class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ this.auth.user.username }}
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <router-link v-if="this.auth.user" class="dropdown-item" to="/logout">{{$t("message.logout")}}</router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LocaleList from '@/components/LocaleList'

export default {
  name: 'Nav',
  components: {
    'LocaleList': LocaleList
  },
  computed: mapState(['lang', 'auth', 'mqtt']),
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
      en: { message: {
        feeds: 'Feeds',
        inputs: 'Inputs',
        login: 'Login',
        logout: 'Logout'
      }
      },
      cy: { message: {
        feeds: 'Ffrwdau',
        inputs: 'Mewnlifau',
        login: 'Mewngofnodwch',
        logout: 'Allgofnodwch'
      }
      }
    }
  }
}
</script>
