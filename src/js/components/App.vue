<template>
  <div class="overflow-hidden">
    <navbar />

    <transition :name="transitionName" mode="out-in">
      <router-view class="animated" />
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Navbar from '@components/Navbar'

export default {
  components: {
    Navbar
  },

  data () {
    return {
      transitionName: null
    }
  },

  watch: {
    '$route' (to, from) {
      this.transitionName = 'fade-in'

      if (from.name === 'Register' && to.name === 'Login') {
        this.transitionName = 'fade-out-right'
      } else if (from.name === 'Login' && to.name === 'Register') {
        this.transitionName = 'fade-out-left'
      }
    }
  },

  created () {
    axios.interceptors.request.use(config => {
      const expiresAt = moment(window.localStorage.getItem('expiresAt'))

      if (expiresAt.isValid() && moment().isBefore(expiresAt)) {
        const diff = moment.duration(expiresAt.diff(moment()))

        if (diff.asHours() < 12 && config.url !== 'auth/refresh') {
          axios.post('auth/refresh')
            .then(({ data }) => {
              this.$store.commit('LOGIN', data)
            })
        }
      }

      return config
    })

    axios.interceptors.response.use(response => response, error => {
      if (error.response && error.response.status === 401) {
        this.$store.dispatch('logout')
      }

      return Promise.reject(error)
    })
  }
}
</script>
