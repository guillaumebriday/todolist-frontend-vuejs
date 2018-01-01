import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'

window.Vue = Vue
Vue.config.productionTip = false

Vue.use(VueRouter)

window.axios = axios

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
