<template>
  <li class="my-4">
    <form @submit.prevent="updateTask">
      <div v-if="error" class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative mb-3" role="alert">
        <span class="block sm:inline">{{ error.message }}</span>
      </div>

      <!-- Task -->
      <div class="text-white leading-none rounded-full shadow-md overflow-hidden p-3" :class="[editTask ? 'bg-white mb-4' : 'bg-indigo']">
        <!-- Update form -->
        <div v-if="editTask" class="flex items-center">
          <div class="border-r w-1/3 pr-1 flex items-center">
            <datetime type="datetime" v-model="form.due_at" placeholder="Due at" :minute-step="5" class="w-full" input-class="w-full"></datetime>
            <span v-if="form.due_at" @click="clearDueAt" class="flex-none rounded-full bg-grey hover:bg-red h-6 w-6 cursor-pointer flex items-center justify-center shadow">
              <i class="fa fa-times text-white"></i>
            </span>
          </div>

          <input v-focus @keyup.esc="cancelEdit" v-model="form.title" placeholder="What needs to be done?"  class="w-full mx-2 rounded-full py-1 px-2 no-outline" type="text">
        </div>

        <div v-else class="flex items-center">
          <!-- Checkbox -->
          <div @click="toggleCompleted" :class="{ 'bg-indigo-darker' : task.is_completed, 'cursor-not-allowed' : isToggleLoading }" class="flex-none rounded-full bg-white h-6 w-6 cursor-pointer flex items-center justify-center shadow">
            <i v-if="isToggleLoading" :class="[task.is_completed ? 'text-white' : 'text-indigo-dark']" class="fa fa-spinner fa-spin" aria-hidden="true"></i>
            <i v-else class="fa fa-check" :class="{'hover:text-indigo-dark' : ! task.is_completed}" aria-hidden="true"></i>
          </div>

          <!-- Clock -->
          <span v-if="task.due_at" @click="editTask = true" :title="toDate(task)" class="flex flex-no-shrink rounded-full bg-indigo-dark uppercase mx-2 px-2 py-1 text-xs font-bold cursor-pointer" :class="{ 'line-through text-grey' : task.is_completed }">
            <i class="fa fa-clock-o mr-1" aria-hidden="true"></i> {{ fromNow(task) }}
          </span>

          <span @click="editTask = true" class="font-semibold mx-2 text-left flex-auto cursor-pointer" :class="{'line-through text-grey' : task.is_completed}">{{ task.title }}</span>
        </div>
      </div>

      <!-- Update buttons -->
      <div v-if="editTask" class="flex items-center justify-between mt-2">
        <div class="flex items-center">
          <button @click="updateTask" type="submit" :class="[isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-indigo hover:bg-white']" class="flex text-white border-2 border-indigo rounded-full bg-indigo uppercase px-3 py-2 text-xs font-bold no-outline align-middle cursor-pointer">
            <i v-if="isUpdateLoading" class="fa fa-spinner fa-spin mr-1" aria-hidden="true"></i>
            <i v-else class="fa fa-check mr-1" aria-hidden="true"></i> Save
          </button>

          <span @click="cancelEdit" class="ml-4 text-grey-darker text-sm cursor-pointer hover:underline">Cancel</span>
        </div>

        <span @click="removeTask" :class="[isRemoveLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline hover:text-red']" class="mx-4 text-grey-darker text-sm">
          <i v-if="isRemoveLoading" class="fa fa-spinner fa-spin mr-1" aria-hidden="true"></i>
          <i v-else class="fa fa-trash mr-1" aria-hidden="true"></i> Delete
        </span>
      </div>
    </form>
  </li>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Form from '@/utils/Form'

export default {
  props: ['task'],

  data () {
    return {
      endpoint: '/tasks/' + this.task.id,
      isToggleLoading: false,
      isRemoveLoading: false,
      isUpdateLoading: false,
      editTask: false,
      error: null,
      form: new Form({
        title: this.task.title,
        due_at: this.task.due_at
      })
    }
  },

  computed: {
    isDisabled () {
      return this.form.title === '' || this.isUpdateLoading
    }
  },

  methods: {
    fromNow (task) {
      return moment(task.due_at).fromNow()
    },

    toDate (task) {
      return moment(task.due_at).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },

    toggleCompleted () {
      if (this.isToggleLoading) {
        return false
      }

      this.isToggleLoading = true
      this.error = null

      axios.patch(this.endpoint, {is_completed: !this.task.is_completed})
        .then(({ data }) => {
          this.$emit('updated', data.data)

          this.isToggleLoading = false
        })
        .catch((error) => {
          this.isToggleLoading = false
          this.error = error
        })
    },

    updateTask () {
      if (this.isDisabled) {
        return false
      }

      this.isUpdateLoading = true
      this.error = null

      if (this.form.due_at) {
        this.form.due_at = moment(this.form.due_at).format('YYYY-MM-DD HH:mm:ss')
      }

      this.form.patch(this.endpoint)
        .then(({ data }) => {
          this.$emit('updated', data)
          this.form.due_at = data.due_at

          this.isUpdateLoading = false
          this.editTask = false
        })
        .catch((error) => {
          this.isUpdateLoading = false
          this.error = error
        })
    },

    cancelEdit () {
      this.editTask = false
      this.error = null

      this.form.title = this.task.title
      this.form.due_at = this.task.due_at
    },

    clearDueAt () {
      this.form.due_at = null
    },

    removeTask () {
      if (this.isRemoveLoading) {
        return false
      }

      this.isRemoveLoading = true
      this.error = null

      axios.delete(this.endpoint)
        .then(() => {
          this.$emit('deleted', this.task)
        })
        .catch(() => {
          this.isRemoveLoading = false
        })
    }
  }
}
</script>
