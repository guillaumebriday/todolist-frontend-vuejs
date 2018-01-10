<template>
<div class="h-screen flex justify-center items-center">
  <div class="w-full max-w-xs">
    <h1 class="text-center mb-6">Todolist</h1>

    <div v-if="hasErrors" class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative mb-3" role="alert">
      <span class="block sm:inline">Incorrect username or password.</span>
    </div>

    <form @submit.prevent="login" class="form-card">
      <div class="mb-4">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="email">
          Email
        </label>
        <input v-focus v-model="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email" type="email" placeholder="Email">
      </div>

      <div class="mb-6">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="password" type="password" placeholder="Password">
      </div>

      <button class="btn-indigo" type="submit" :disabled="this.isDisabled" :class="{ 'opacity-50 cursor-not-allowed': this.isDisabled }">
        <i v-if="isLoading" class="fa fa-spinner fa-spin fa-fw"></i>
        Sign In
      </button>

      <div class="mt-4 text-sm">
        Don't have an account?
        <router-link class="inline-block font-bold text-indigo hover:text-indigo-darker" to="/register" exact>
          Register now
        </router-link>
      </div>
    </form>
  <p class="text-center text-grey text-xs">
    Source code available on <a href="https://github.com/guillaumebriday/todolist-frontend" class="text-grey">GitHub</a>.
  </p>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      email: '',
      password: '',
      isLoading: false,
      hasErrors: false
    }
  },

  computed: {
    isDisabled () {
      return this.email.length === 0 || this.password.length === 0
    }
  },

  methods: {
    login () {
      if (this.isDisabled) {
        return false
      }

      this.isLoading = true
      this.hasErrors = false

      axios
        .post('auth/login', {
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.isLoading = false

          this.$store.dispatch('login', response.data.access_token)
        })
        .catch(error => {
          console.log(error)

          this.isLoading = false
          this.hasErrors = true
          this.password = ''
        })
    }
  }
}
</script>

