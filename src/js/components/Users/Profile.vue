<template>
  <div>
    <navbar></navbar>
    <div class="container md:flex mx-auto mt-3 px-4">
      <sidebar class="flex-none w-full md:max-w-xs"></sidebar>

      <div class="flex-1">
        <div class="rounded overflow-hidden bg-white px-6 py-6 shadow-md">
          <p class="font-bold text-xl mb-6 pb-6 border-b">Update your profile</p>

          <form @submit.prevent="update" class="w-full max-w-md" @keydown="form.errors.clear($event.target.name)">
            <div class="md:flex md:items-center mb-4">
              <div class="md:w-1/3">
                <label class="block text-grey-darker md:text-right text-sm font-bold mb-1 pr-4" for="name">Name</label>
              </div>

              <div class="md:w-2/3">
                <input v-focus v-model="form.name" class="form-control" :class="{ 'border-red mb-3' : form.errors.has('name') }" id="name" type="text" name="name" placeholder="Name">
                <p v-if="form.errors.has('name')" class="text-red text-xs italic">{{ form.errors.get('name') }}</p>
              </div>
            </div>

            <div class="md:flex md:items-center mb-6">
              <div class="md:w-1/3">
                <label class="block text-grey-darker md:text-right text-sm font-bold mb-1 pr-4" for="email">Email</label>
              </div>

              <div class="md:w-2/3">
                <input v-model="form.email" class="form-control" :class="{ 'border-red mb-3' : form.errors.has('email') }" id="email" type="email" name="email" placeholder="Email">
                <p v-if="form.errors.has('email')" class="text-red text-xs italic">{{ form.errors.get('email') }}</p>
              </div>
            </div>

            <div class="md:flex md:items-center mb-6">
              <div class="md:w-1/3"></div>
              <div class="md:w-2/3">
                <loading-button :isLoading="isLoading" :disabled="isDisabled" :class="[{ 'opacity-50 cursor-not-allowed': isDisabled }]" class="btn-indigo">
                  Update
                </loading-button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@components/Navbar'
import Sidebar from '@components/Users/Sidebar'
import Form from '@utils/Form'

export default {
  components: {
    Navbar,
    Sidebar
  },

  data () {
    return {
      form: new Form({
        email: '',
        name: ''
      }),
      isLoading: false
    }
  },

  computed: {
    isDisabled () {
      if (this.isLoading || this.form.incompleted()) {
        return true
      }

      return this.form.email === this.user.email && this.form.name === this.user.name
    },

    user () {
      return this.$store.state.auth.user
    }
  },

  watch: {
    user () {
      this.setForm()
    }
  },

  methods: {
    getUser () {
      this.$store.dispatch('fetchUser')
    },

    update () {
      if (this.isDisabled) {
        return false
      }

      this.isLoading = true
      this.form.errors.clear()

      this.form.put('users/' + this.user.id)
        .then(data => {
          this.isLoading = false
          this.$store.commit('setUser', data.data)
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    setForm () {
      this.form = new Form({
        email: this.user.email,
        name: this.user.name
      })
    }
  },

  created () {
    if (!this.user) {
      this.getUser()
    } else {
      this.setForm()
    }
  }
}
</script>
