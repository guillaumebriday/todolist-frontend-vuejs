<template>
  <nav v-if="isLogged" class="bg-indigo">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between">
        <div>
          <router-link class="text-white no-underline font-bold text-3xl hover:underline" to="/" exact>
            Todolist
          </router-link>
        </div>

        <div>
          <router-link class="text-white no-underline hover:underline ml-4" :to="{ name: 'Profile'}" exact>
            <fa icon="user" class="mr" />
            Profile
          </router-link>

          <button class="text-grey-light ml-4 border border-white py-2 px-4 rounded hover:bg-white hover:text-indigo" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Navbar',

  computed: mapGetters([
    'isLogged'
  ]),

  methods: {
    logout () {
      axios.delete('/auth/logout')
      this.$store.dispatch('logout')
    }
  }
}
</script>
