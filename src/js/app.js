import './bootstrap'

import Vue from 'vue'
import App from '@components/App'
import router from '@router'
import store from '@store'
import moment from 'moment'
require.context('../images', true)

moment.tz.setDefault(moment.tz.guess())

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
