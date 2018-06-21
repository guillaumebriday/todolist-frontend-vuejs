import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import Datetime from 'vue-datetime'

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faKey from '@fortawesome/fontawesome-free-solid/faKey'
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faLock from '@fortawesome/fontawesome-free-solid/faLock'
import faHeart from '@fortawesome/fontawesome-free-solid/faHeart'
import faMobileAlt from '@fortawesome/fontawesome-free-solid/faMobileAlt'
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub'
import faClock from '@fortawesome/fontawesome-free-regular/faClock'
import faLightbulb from '@fortawesome/fontawesome-free-regular/faLightbulb'
import faCheckCircle from '@fortawesome/fontawesome-free-regular/faCheckCircle'

import LoadingButton from '@components/LoadingButton'
import FormError from '@components/FormError'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'

window.axios = axios

Vue.config.productionTip = false

fontawesome.library.add(faTimes, faSpinner, faCheck, faUser, faKey, faTrash, faPlus, faLock, faHeart, faMobileAlt, faExclamationTriangle)
fontawesome.library.add(faGithub)
fontawesome.library.add(faClock, faLightbulb, faCheckCircle)

Vue.use(VueRouter)
Vue.use(Datetime)

Vue.component('LoadingButton', LoadingButton)
Vue.component('FormError', FormError)
Vue.component('Fa', FontAwesomeIcon)

Vue.directive('focus', {
  inserted (el) {
    el.focus()
  }
})

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.token
axios.defaults.baseURL = `${BASE_URL}/api/v1/`

if (process.env.PUSHER_APP_KEY) {
  window.Pusher = Pusher

  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.PUSHER_APP_KEY,
    cluster: 'eu',
    encrypted: true,
    authEndpoint: `${BASE_URL}/broadcasting/auth`,
    auth: {
      headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
    }
  })
}
