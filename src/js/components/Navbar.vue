<template>
  <nav class="bg-indigo" v-if="isLogged">
    <div class="container mx-auto px-8 py-4">
      <div class="flex justify-between">
        <div>
          <router-link class="text-white no-underline font-bold text-3xl hover:underline" to="/" exact>
            Todolist
          </router-link>
        </div>

        <button @click="logout" class="text-grey-light mr-3 border border-white py-2 px-4 rounded hover:bg-white hover:text-indigo">
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',

  computed: mapGetters([
    'isLogged'
  ]),

  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>
