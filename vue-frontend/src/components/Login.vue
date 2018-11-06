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
                    <label for="email">{{ $t('message.username') }}</label>
                    <input v-model="app.mqtt.username" type="text" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter emoncms username" required>
                </div>
                <div class="form-group">
                    <label for="password">{{ $t('message.password') }}</label>
                    <input v-model="app.mqtt.password" type="password" class="form-control" id="password" placeholder="Password" required>
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
import { auth } from './mixins/authenticate'

export default {
  name: 'Login',
  props: ['app'],
  mixins: [auth],
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
