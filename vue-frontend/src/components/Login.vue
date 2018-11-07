<template>
    <div id="login-modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">

            <form id="login-form" class="modal-content" action="https://emoncms.org/user/login.json" method="POST" @submit="login">
                <div class="modal-header">
                <h5 class="modal-title">{{ $t('message.login') }} EmonCMS</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                <div class="form-group">
                    <label for="input_username">{{ $t('message.username') }}</label>
                    <input v-model="username" type="text" class="form-control" name="username" id="input_username" aria-describedby="usernameHelp" placeholder="Enter emoncms username" required>
                </div>
                <div class="form-group">
                    <label for="input_password">{{ $t('message.password') }}</label>
                    <input v-model="password" type="password" class="form-control" name="password" id="input_password" placeholder="Password" required>
                    <small id="emailHelp" class="form-text text-muted"><a href="https://emoncms.org/">Forgotton password?</a></small>
                </div>
                <div v-if="error" class="alert alert-warning">
                    {{error}}
                </div>
                <div v-if="false" class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="rememberme">
                    <label class="form-check-label" for="rememberme">Remember me</label>
                </div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Login</button>
                </div>
            </form>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { auth } from '@/components/mixins/authenticate' // eslint-disable-line no-unused-vars, no-undef
import { mqtt } from '@/components/mixins/mqtt' // eslint-disable-line no-unused-vars, no-undef

export default {
  name: 'Login',
  mixins: [auth, mqtt],
  computed: mapState(['lang', 'auth', 'mqtt']),
  i18n: {
    messages: {
      en: { message: {
        login: 'Login to ',
        username: 'Username ',
        password: 'Password '
      }},
      cy: { message: {
        login: 'Mewngofnodi i ',
        username: 'Cyfrif',
        password: 'Cyfrinair'
      }}
    }
  }
}
</script>
