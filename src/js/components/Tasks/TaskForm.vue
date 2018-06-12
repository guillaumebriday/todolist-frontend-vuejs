<template>
  <div class="my-4">
    <form v-if="isShown" @submit.prevent="addTask">
      <form-error :error="error"></form-error>

      <div class="p-3 mb-4 appearance-none bg-white rounded-lg flex flex-col shadow">
        <input v-focus @keyup.esc="cancel" v-model="form.title" class="w-full mb-2 pt-1 pb-2 px-2 no-outline font-semibold border-b" placeholder="What needs to be done?" ref="task" />

        <div class="flex items-center text-xs">
          <fa :icon="['far', 'clock']" class="mr-1 text-grey-dark" />
          <datetime type="datetime" v-model="form.due_at" placeholder="Due at" :minute-step="5" input-class="text-grey-dark"></datetime>

          <span v-if="form.due_at" @click="clearDueAt" class="flex-none rounded-full bg-grey hover:bg-red h-6 w-6 cursor-pointer flex items-center justify-center shadow">
            <fa icon="times" class="text-white" />
          </span>
        </div>
      </div>

      <div class="flex items-center my-4">
        <loading-button
          :isLoading="isLoading"
          :disabled="isDisabled"
          :class="{'opacity-50 cursor-not-allowed' : isDisabled}"
          icon="plus"
          class="btn-indigo text-sm">
            Add
        </loading-button>

        <span @click="cancel" class="ml-4 text-grey-darker text-sm cursor-pointer hover:underline">Cancel</span>
      </div>
    </form>

    <button v-else @click="isShown = true" class="hover:underline text-grey-darker text-sm cursor-pointer">
      <fa icon="plus" class="mr-1" />
      Add task
    </button>
  </div>
</template>

<script>
import Form from '@utils/Form'
import moment from 'moment'
import 'vue-datetime/dist/vue-datetime.css'

export default {
  data () {
    return {
      isLoading: false,
      isShown: false,
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

      this.$store.dispatch('addTask', {
        title: this.form.title,
        due_at: this.form.due_at ? moment(this.form.due_at).format('YYYY-MM-DD HH:mm:ss') : null
      })
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
    },

    cancel () {
      this.isShown = false

      this.form.reset()
    }
  }
}
</script>
