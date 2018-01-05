import router from '../router'

const types = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

const state = {
  logged: !!localStorage.getItem('token')
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
  login ({ commit }, token) {
    commit(types.LOGIN)
    localStorage.setItem('token', token)

    router.push({name: 'Home'})
  },

  logout ({ commit }) {
    commit(types.LOGOUT)
    localStorage.removeItem('token')

    router.push({name: 'Login'})
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
