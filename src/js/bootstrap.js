import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import Navbar from './components/Navbar'
import TaskList from './components/Tasks/TaskList'
import Task from './components/Tasks/Task'
import TaskForm from './components/Tasks/TaskForm'

const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1/'

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
axios.defaults.baseURL = API_URL
