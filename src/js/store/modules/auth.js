import router from '@router'
import axios from 'axios'
import moment from 'moment'

const types = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

const state = {
  user: null,
  endpoint: '/users/',
  logged: !!window.localStorage.getItem('token')
}

const mutations = {
  setUser (state, user) {
    state.user = user
  },

  [types.LOGIN] (state, data) {
    state.logged = true

    window.localStorage.setItem('token', data.access_token)
    window.localStorage.setItem('userId', data.user_id)
    window.localStorage.setItem('expiresAt', moment().add(data.expires_in, 'seconds').format())
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token
  },

  [types.LOGOUT] (state) {
    state.logged = false
    state.user = null

    window.localStorage.removeItem('token')
    window.localStorage.removeItem('userId')
    window.localStorage.removeItem('expiresAt')

    delete axios.defaults.headers.common['Authorization']
  }
}

const getters = {
  isLogged: state => state.logged
}

const actions = {
  fetchUser ({ commit }) {
    return axios.get('/auth/me')
      .then(({ data }) => {
        commit('setUser', data.data)
        return data.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  login ({ commit, dispatch }, data) {
    commit(types.LOGIN, data)

    dispatch('fetchUser')

    router.push({ name: 'TaskList', params: { status: 'active' } })
  },

  logout ({ commit }) {
    commit(types.LOGOUT)
    commit('clearTasks')

    router.push({ name: 'Login' })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
