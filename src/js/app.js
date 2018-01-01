import './bootstrap'

import Vue from 'vue'
import App from './components/App'
import router from './router'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
