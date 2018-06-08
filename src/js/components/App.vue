<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  created () {
    axios.interceptors.response.use(response => response, error => {
      if (error.response.status === 401) {
        this.$store.dispatch('logout')
      }

      return Promise.reject(error)
    })
  }
}
</script>
