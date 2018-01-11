import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Navbar from './components/Navbar'

const API_URL = process.env.API_URL || 'http://localhost/api/v1/'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.component('Navbar', Navbar)

Vue.directive('focus', {
  inserted (el) {
    el.focus()
  }
})

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token
axios.defaults.baseURL = API_URL
