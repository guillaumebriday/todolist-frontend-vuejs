<template>
<div class="h-screen flex justify-center items-center">
  <div class="w-full max-w-xs">
    <h1 class="text-center mb-6">Todolist</h1>

    <div v-if="hasErrors" class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative mb-3" role="alert">
      <span class="block sm:inline">Whoops, looks like something went wrong. Please try again.</span>
    </div>

    <form @submit.prevent="register" class="form-card">
      <div class="mb-4">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="name">
          Name
        </label>
        <input v-focus v-model="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="name" type="text" :class="{ 'border-red mb-3' : this.errors['name'] }" placeholder="Name">
        <p v-if="this.errors['name']" class="text-red text-xs italic">{{ this.errors['name'][0] }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="username">
          Email
        </label>
        <input v-model="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" :class="{ 'border-red mb-3' : this.errors['email'] }" id="username" type="email" placeholder="Email">
        <p v-if="this.errors['email']" class="text-red text-xs italic">{{ this.errors['email'][0] }}</p>
      </div>

      <div class="mb-6">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" :class="{ 'border-red mb-3' : this.errors['password'] }" id="password" type="password" placeholder="Password">
        <p v-if="this.errors['password']" class="text-red text-xs italic">{{ this.errors['password'][0] }}</p>
      </div>

      <div class="mb-6">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password_confirmation">
          Password confirmation
        </label>
        <input v-model="password_confirmation" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="password_confirmation" type="password" placeholder="Password confirmation">
      </div>

      <div class="flex items-center justify-between">
        <button class="btn-indigo" type="submit" :disabled="this.isDisabled" :class="{ 'opacity-50 cursor-not-allowed': this.isDisabled }">
          <i v-if="isLoading" class="fa fa-spinner fa-spin fa-fw"></i>
          Register
        </button>
      </div>

      <div class="mt-4 text-sm">
        Already have an account ?

        <router-link class="inline-block font-bold text-indigo hover:text-indigo-darker" to="/login" exact>
          Log in now
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
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      isLoading: false,
      hasErrors: false,
      errors: []
    }
  },

  computed: {
    isDisabled () {
      return this.email.length === 0 || this.name.length === 0 || this.password.length === 0 || this.password_confirmation.length === 0
    }
  },

  methods: {
    register () {
      if (this.isDisabled) {
        return false
      }

      this.isLoading = true
      this.hasErrors = false

      axios
        .post('auth/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        })
        .then(response => {
          // Login the created user
          axios
            .post('auth/login', {
              email: this.email,
              password: this.password
            })
            .then(response => {
              this.$store.dispatch('login', response.data.access_token)
            })
            .catch(error => {
              console.log(error)

              this.hasErrors = false
            })
        })
        .catch(error => {
          console.log(error)

          this.isLoading = false
          this.errors = error.response.data.errors
          this.password = ''
          this.password_confirmation = ''
        })
    }
  }
}
</script>

