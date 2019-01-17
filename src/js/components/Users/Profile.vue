<template>
  <div class="flex-1">
    <div class="rounded overflow-hidden bg-white px-6 py-6 shadow-md">
      <h2 class="font-bold text-xl mb-6 pb-6 border-b">
        Update your profile
      </h2>

      <form class="w-full max-w-md" @submit.prevent="update" @keydown="form.errors.clear($event.target.name)">
        <div class="md:flex md:items-center mb-4">
          <div class="md:w-1/3">
            <label class="block text-grey-darker md:text-right text-sm font-bold mb-1 pr-4" for="name">
              Name
            </label>
          </div>

          <div class="md:w-2/3">
            <input id="name" v-model="form.name" v-focus class="form-control" :class="{ 'border-red mb-3' : form.errors.has('name') }" type="text" name="name" placeholder="Name">
            <p v-if="form.errors.has('name')" class="text-red text-xs italic">
              {{ form.errors.get('name') }}
            </p>
          </div>
        </div>

        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label class="block text-grey-darker md:text-right text-sm font-bold mb-1 pr-4" for="email">
              Email
            </label>
          </div>

          <div class="md:w-2/3">
            <input id="email" v-model="form.email" class="form-control" :class="{ 'border-red mb-3' : form.errors.has('email') }" type="email" name="email" placeholder="Email">
            <p v-if="form.errors.has('email')" class="text-red text-xs italic">
              {{ form.errors.get('email') }}
            </p>
          </div>
        </div>

        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3" />
          <div class="md:w-2/3">
            <loading-button :is-loading="isLoading" :disabled="isDisabled" :class="[{ 'opacity-50 cursor-not-allowed': isDisabled }]" class="btn-indigo">
              Update
            </loading-button>
          </div>
        </div>
      </form>

      <h2 class="font-bold text-red text-xl mb-6 pb-6 border-b">
        Delete your account
      </h2>

      <p>Once you delete your account, there is no going back. Please be certain.</p>

      <loading-button
        :is-loading="isDeleteLoading"
        :disabled="isDeleteDisabled"
        :class="{'opacity-50 cursor-not-allowed' : isDeleteDisabled}"
        icon="trash"
        class="btn-red mt-4 text-sm"
        @click.native.prevent="deleteAccount"
      >
        Delete your account
      </loading-button>
    </div>
  </div>
</template>

<script>
import Form from '@utils/Form'
import axios from 'axios'

export default {
  data () {
    return {
      form: new Form({
        email: '',
        name: ''
      }),
      isLoading: false,
      isDeleteLoading: false
    }
  },

  computed: {
    isDisabled () {
      if (this.isLoading || this.form.incompleted() || !this.user) {
        return true
      }

      return this.form.email === this.user.email && this.form.name === this.user.name
    },

    isDeleteDisabled () {
      return this.isDeleteLoading || !this.user
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

  created () {
    if (!this.user) {
      this.getUser()
    } else {
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
      if (!this.user) {
        return false
      }

      this.form = new Form({
        email: this.user.email,
        name: this.user.name
      })
    },

    deleteAccount () {
      if (this.isDeleteDisabled || !window.confirm('Are you sure ? Your tasks and your account will be deleted forever.')) {
        return false
      }

      this.isDeleteLoading = true

      axios.delete('/users/' + this.user.id)
        .then(() => {
          this.$store.dispatch('logout')
        })
        .catch(() => {
          this.isDeleteLoading = false
        })
    }
  }
}
</script>
