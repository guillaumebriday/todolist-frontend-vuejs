import router from '@router'
import axios from 'axios'

const types = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

const state = {
  logged: !!window.localStorage.getItem('token')
}

const mutations = {
  [types.LOGIN] (state) {
    state.logged = true
  },

  [types.LOGOUT] (state) {
    state.logged = false
  }
}

const getters = {
  isLogged: state => state.logged
}

const actions = {
  login ({ commit }, data) {
    commit(types.LOGIN)

    window.localStorage.setItem('token', data.access_token)
    window.localStorage.setItem('userId', data.user_id)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token

    router.push({name: 'TaskList', params: { status: 'active' }})
  },

  logout ({ commit }) {
    commit(types.LOGOUT)
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('userId')

    delete axios.defaults.headers.common['Authorization']

    router.push({name: 'Login'})
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
