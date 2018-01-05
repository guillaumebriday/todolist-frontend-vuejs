import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Navbar from './components/Navbar'

window.Vue = Vue
Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.component('Navbar', Navbar)

window.axios = axios

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
