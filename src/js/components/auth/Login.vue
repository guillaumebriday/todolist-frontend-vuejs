<template>
<div class="h-screen flex justify-center items-center">
  <div class="w-full max-w-xs">
    <h1 class="text-center mb-6">Todolist</h1>

    <form @submit.prevent="login" @keydown="form.errors.clear($event.target.name)" class="form-card">
      <div class="mb-4">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="email">Email</label>

        <input v-focus v-model="form.email" class="form-control" :class="{ 'border-red mb-3' : form.errors.has('email') }" id="email" type="email" name="email" placeholder="Email">
        <p v-if="form.errors.has('email')" class="text-red text-xs italic">{{ form.errors.get('email') }}</p>
      </div>

      <div class="mb-6">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password">Password</label>

        <input v-model="form.password" class="form-control" :class="{ 'border-red mb-3' : form.errors.has('password') }" id="password" type="password" name="password" placeholder="Password">
        <p v-if="form.errors.has('password')" class="text-red text-xs italic">{{ form.errors.get('password') }}</p>
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
import Form from '@/utils/Form'

export default {
  data () {
    return {
      form: new Form({
        email: '',
        password: ''
      }),
      isLoading: false
    }
  },

  computed: {
    isDisabled () {
      return this.form.incompleted()
    }
  },

  methods: {
    login () {
      if (this.isDisabled) {
        return false
      }

      this.isLoading = true

      this.form.post('auth/login')
        .then(data => {
          this.$store.dispatch('login', data.access_token)
        })
        .catch(() => {
          this.isLoading = false
          this.form.password = ''
        })
    }
  }
}
</script>

