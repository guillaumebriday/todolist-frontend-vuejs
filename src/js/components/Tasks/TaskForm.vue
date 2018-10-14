<template>
  <div class="my-4">
    <form v-if="isShown" @submit.prevent="addTask">
      <form-error :error="error" />

      <div class="p-3 mb-4 appearance-none bg-white rounded-lg flex flex-col shadow">
        <input ref="task" v-model="form.title" v-focus class="w-full mb-2 pt-1 pb-2 px-2 focus:outline-none font-semibold border-b" placeholder="What needs to be done?" @keyup.esc="cancel">

        <div class="flex items-center text-xs">
          <fa :icon="['far', 'clock']" class="mr-1 text-grey-dark" />
          <datetime v-model="form.due_at" type="datetime" placeholder="Due at" :minute-step="5" input-class="text-grey-dark" />

          <span v-if="form.due_at" class="flex-none rounded-full bg-grey hover:bg-red h-6 w-6 cursor-pointer flex items-center justify-center shadow" @click="clearDueAt">
            <fa icon="times" class="text-white" />
          </span>
        </div>
      </div>

      <div class="flex items-center my-4">
        <loading-button
          :is-loading="isLoading"
          :disabled="isDisabled"
          :class="{'opacity-50 cursor-not-allowed' : isDisabled}"
          icon="plus"
          class="btn-indigo text-sm"
        >
          Add
        </loading-button>

        <span class="ml-4 text-grey-darker text-sm cursor-pointer hover:underline" @click="cancel">Cancel</span>
      </div>
    </form>

    <button v-else class="hover:underline text-grey-darker text-sm cursor-pointer" @click="isShown = true">
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
        due_at: moment(this.form.due_at).seconds(0)
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
