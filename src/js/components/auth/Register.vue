<template>
<div class="h-screen flex justify-center items-center">
  <div class="w-full max-w-xs">
    <h1 class="text-center mb-6">Todolist</h1>

    <div v-if="error" class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative mb-3" role="alert">
      <span class="block sm:inline">{{ error.message }}</span>
    </div>

    <form @submit.prevent="register" @keydown="form.errors.clear($event.target.name)" class="form-card">
      <div class="mb-4">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="name">Name</label>

        <input v-focus v-model="form.name" class="form-control" id="name" type="text" :class="{ 'border-red mb-3' : form.errors.has('name') }" name="name" placeholder="Name">
        <p v-if="form.errors.has('name')" class="text-red text-xs italic">{{ form.errors.get('name') }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="username">Email</label>

        <input v-model="form.email" class="form-control" :class="{ 'border-red mb-3' : form.errors.has('email') }" id="username" type="email" name="email" placeholder="Email">
        <p v-if="form.errors.has('email')" class="text-red text-xs italic">{{ form.errors.get('email') }}</p>
      </div>

      <div class="mb-6">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password">Password</label>

        <input v-model="form.password" class="form-control" :class="{ 'border-red mb-3' : form.errors.has('password') }" id="password" type="password" name="password" placeholder="Password">
        <p v-if="form.errors.has('password')" class="text-red text-xs italic">{{ form.errors.get('password') }}</p>
      </div>

      <div class="mb-6">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password_confirmation">Password confirmation</label>

        <input v-model="form.password_confirmation" class="form-control" id="password_confirmation" type="password" name="password_confirmation" placeholder="Password confirmation">
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
import Form from '@/utils/Form'

export default {
  data () {
    return {
      form: new Form({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }),
      isLoading: false,
      error: false
    }
  },

  computed: {
    isDisabled () {
      return this.form.incompleted() || this.isLoading
    }
  },

  methods: {
    register () {
      if (this.isDisabled) {
        return false
      }

      this.isLoading = true
      this.error = null

      this.form.post('auth/register')
        .then(data => this.$store.dispatch('login', data))
        .catch(error => {
          this.isLoading = false
          this.error = error

          this.form.password = ''
          this.form.password_confirmation = ''
        })
    }
  }
}
</script>

