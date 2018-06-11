import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@store/modules/auth'
import tasks from '@store/modules/tasks'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    tasks
  }
})
