import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import Navbar from './components/Navbar'
import TaskList from './components/Tasks/TaskList'
import Task from './components/Tasks/Task'
import TaskForm from './components/Tasks/TaskForm'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'

window.axios = axios

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Datetime)

Vue.component('Navbar', Navbar)

Vue.component('TaskList', TaskList)
Vue.component('Task', Task)
Vue.component('TaskForm', TaskForm)

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
