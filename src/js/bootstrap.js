import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import axios from 'axios'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import Datetime from 'vue-datetime'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faTimes,
  faSpinner,
  faCheck,
  faUser,
  faKey,
  faTrash,
  faPlus,
  faLock,
  faHeart,
  faMobileAlt,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faClock, faLightbulb, faCheckCircle } from '@fortawesome/free-regular-svg-icons'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'

window.axios = axios

Vue.config.productionTip = false

library.add(faTimes, faSpinner, faCheck, faUser, faKey, faTrash, faPlus, faLock, faHeart, faMobileAlt, faExclamationTriangle)
library.add(faGithub)
library.add(faClock, faLightbulb, faCheckCircle)

// Plugins
Vue.use(VueRouter)
Vue.use(VueMeta)
Vue.use(Datetime)

// Components
Vue.component('LoadingButton', () => import('@components/LoadingButton'))
Vue.component('FormError', () => import('@components/FormError'))
Vue.component('Fa', FontAwesomeIcon)

// Directives
Vue.directive('focus', {
  inserted (el) {
    el.focus()
  }
})

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common.Authorization = 'Bearer ' + window.localStorage.token
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
      headers: { Authorization: 'Bearer ' + window.localStorage.token }
    }
  })
}
