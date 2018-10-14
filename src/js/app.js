import './bootstrap'

import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import App from '@components/App'
import router from '@router'
import store from '@store'
require.context('../images', true)

Vue.use(VueAnalytics, {
  id: process.env.TRACKING_ID,
  router,
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
