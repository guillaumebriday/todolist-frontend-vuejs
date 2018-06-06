<template>
  <form @submit.prevent="addTask">
    <form-error :error="error"></form-error>

    <div class="p-3 mb-4 appearance-none bg-white border-none rounded-full flex shadow-md items-center">
      <div class="border-r w-1/3 pr-1 flex items-center">
        <datetime type="datetime" v-model="form.due_at" placeholder="Due at" :minute-step="5" class="w-full" input-class="w-full"></datetime>
        <span v-if="form.due_at" @click="clearDueAt" class="flex-none rounded-full bg-grey hover:bg-red h-6 w-6 cursor-pointer flex items-center justify-center shadow">
          <i class="fa fa-times text-white"></i>
        </span>
      </div>

      <input v-focus v-model="form.title" class="w-full no-outline px-3" placeholder="What needs to be done?" ref="task" />
    </div>

    <div class="flex justify-end my-4">
      <loading-button
        :isLoading="isLoading"
        :disabled="isDisabled"
        :class="[isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-indigo hover:bg-white']"
        icon="fa-plus"
        class="text-white border-2 border-indigo rounded-full bg-indigo uppercase px-3 py-2 text-xs font-bold no-outline">
          Add
      </loading-button>
    </div>
  </form>
</template>

<script>
import Form from '@/utils/Form'
import moment from 'moment'

export default {
  data () {
    return {
      isLoading: false,
      error: null,
      form: new Form({
        title: '',
        due_at: null
      })
    }
  },

  computed: {
    isDisabled () {
      return this.form.title === '' || this.isLoading
    }
  },

  methods: {
    addTask () {
      if (this.isDisabled) {
        return false
      }

      this.isLoading = true
      this.error = null

      if (this.form.due_at) {
        this.form.due_at = moment(this.form.due_at).format('YYYY-MM-DD HH:mm:ss')
      }

      this.$store.dispatch('addTask', this.form)
        .then(() => {
          this.form.reset()
          this.$refs.task.focus()
          this.isLoading = false
        })
        .catch(error => {
          this.error = error.response.data
          this.isLoading = false
        })
    },

    clearDueAt () {
      this.form.due_at = null
    }
  }
}
</script>
