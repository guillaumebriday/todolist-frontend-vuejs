<template>
  <div>
    <div class="container md:flex mx-auto my-3 px-4">
      <sidebar class="flex-none w-full md:max-w-xs" />

      <transition :name="transitionName" mode="out-in">
        <router-view class="animated" />
      </transition>
    </div>
  </div>
</template>

<script>
import Sidebar from '@components/Users/Sidebar'

export default {
  components: {
    Sidebar
  },

  data () {
    return {
      transitionName: null
    }
  },

  watch: {
    '$route' (to, from) {
      if (from.name === 'Profile' && to.name === 'Security') {
        this.transitionName = 'fade-out-right'
      } else if (from.name === 'Security' && to.name === 'Profile') {
        this.transitionName = 'fade-out-left'
      }
    }
  }
}
</script>
