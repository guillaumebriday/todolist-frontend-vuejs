import axios from 'axios'

const state = {
  tasks: [],
  endpoint: '/tasks/'
}

const mutations = {
  setTasks (state, tasks) {
    state.tasks = tasks
  },

  addTask (state, task) {
    state.tasks.push(task)
  },

  updateTask (state, task) {
    let taskId = task.id
    state.tasks.splice(state.tasks.findIndex(task => task.id === taskId), 1, task)
  },

  removeTask (state, task) {
    let taskId = task.id
    state.tasks.splice(state.tasks.findIndex(task => task.id === taskId), 1)
  },

  clearTasks (state) {
    state.tasks = []
  }
}

const getters = {
  filteredTasks: (state, getters) => (status) => {
    if (status === 'completed') {
      return getters.completedTasks
    } else if (status === 'active') {
      return getters.activeTasks
    }

    return getters.allTasks
  },

  allTasks (state) {
    return state.tasks
  },

  activeTasks (state) {
    return state.tasks.filter(task => task.is_completed === false)
  },

  completedTasks (state) {
    return state.tasks.filter(task => task.is_completed === true)
  },

  timeToChill: (state, getters) => (status) => {
    return !state.tasks.length ||
            (status === 'active' && !getters.activeTasks.length) ||
            (status === 'completed' && !getters.completedTasks.length)
  }
}

const actions = {
  fetchTasks ({ commit }, params) {
    return new Promise((resolve, reject) => {
      axios.get(state.endpoint)
        .then(({ data }) => {
          commit('setTasks', data.data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  addTask ({ commit }, form) {
    return new Promise((resolve, reject) => {
      axios.post(state.endpoint, form)
        .then(({ data }) => {
          commit('addTask', data.data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  updateTask ({ commit }, {task, form}) {
    return new Promise((resolve, reject) => {
      axios.patch(state.endpoint + task.id, form)
        .then(({ data }) => {
          commit('updateTask', data.data)
          resolve(data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  removeTask ({ commit }, task) {
    return new Promise((resolve, reject) => {
      axios.delete(state.endpoint + task.id)
        .then(response => {
          commit('removeTask', task)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  deleteTasks ({ commit, getters }) {
    return new Promise((resolve, reject) => {
      axios.delete(state.endpoint)
        .then(response => {
          getters.completedTasks.forEach(task => commit('removeTask', task))
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
