<template>
  <li class="my-4">
    <on-click-outside :do="handleClickOutside">
      <form @submit.prevent="updateTask">
        <form-error :error="error"></form-error>

        <!-- Task -->
        <div class="bg-white leading-none rounded-lg shadow overflow-hidden p-3 mb-4">
          <!-- Update form -->
          <div v-if="editTask" class="flex flex-col">
            <input v-focus @keyup.esc="cancelEdit" v-model="form.title" placeholder="What needs to be done?"  class="w-full mb-2 pb-2 px-2 no-outline text-lg font-semibold border-b" type="text">

            <div class="flex items-center text-xs">
              <i class="fa fa-clock-o mr-1 text-grey-dark" aria-hidden="true"></i>
              <datetime type="datetime" v-model="form.due_at" placeholder="Due at" :minute-step="5" input-class="text-grey-dark"></datetime>

              <span v-if="form.due_at" @click="clearDueAt" class="flex-none rounded-full bg-grey hover:bg-red h-6 w-6 cursor-pointer flex items-center justify-center shadow">
                <i class="fa fa-times text-white"></i>
              </span>
            </div>
          </div>

          <div v-else class="flex items-center">
            <div class="flex-grow">
              <p @click="editTask = true" class="font-semibold text-lg mx-2 text-left flex-auto cursor-pointer" :class="{'line-through text-grey' : task.is_completed}">{{ task.title }}</p>

              <span v-if="task.due_at" @click="editTask = true" :title="toDate(task)" class="flex flex-no-shrink mr-2 mt-2 px-2 py-1 text-xs cursor-pointer" :class="[task.is_completed ? 'line-through text-grey' : 'text-grey-dark']">
                <i class="fa fa-clock-o mr-1" aria-hidden="true"></i> {{ fromNow(task) }}
              </span>
            </div>

            <!-- Checkbox -->
            <div @click="toggleCompleted" :class="[task.is_completed ? 'bg-indigo' : 'border-2', {'cursor-not-allowed' : isToggleLoading}]" class="rounded-full bg-white h-6 w-6 cursor-pointer flex items-center justify-center">
              <i v-if="isToggleLoading" class="fa fa-spinner fa-spin" :class="[task.is_completed ? 'text-white' : 'text-indigo']" aria-hidden="true"></i>
              <i v-else class="fa fa-check text-white" :class="{'hover:text-indigo' : ! task.is_completed}" aria-hidden="true"></i>
            </div>
          </div>
        </div>

        <!-- Update buttons -->
        <div v-if="editTask" class="flex items-center justify-between mt-2">
          <div class="flex items-center">
            <loading-button
              @click.native="updateTask"
              :isLoading="isUpdateLoading"
              :class="{'opacity-50 cursor-not-allowed' : isDisabled}"
              icon="fa-check"
              class="btn-indigo text-sm">
                Save
            </loading-button>

            <span @click="cancelEdit" class="ml-4 text-grey-darker text-sm cursor-pointer hover:underline">Cancel</span>
          </div>

          <loading-button
            @click.native="removeTask"
            :isLoading="isRemoveLoading"
            :class="[isRemoveLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline hover:text-red']"
            type="button"
            icon="fa-trash"
            class="mx-4 text-grey-darker text-sm">
              Delete
          </loading-button>
        </div>
      </form>
    </on-click-outside>
  </li>
</template>

<script>
import moment from 'moment'
import Form from '@/utils/Form'
import OnClickOutside from '@components/OnClickOutside'

export default {
  components: { OnClickOutside },
  props: {
    task: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
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
    },

    isNotLoading () {
      return !(this.isToggleLoading || this.isRemoveLoading || this.isUpdateLoading)
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

      this.$store.dispatch('updateTask', {
        task: this.task,
        form: { is_completed: !this.task.is_completed }
      })
        .then(() => {
          this.isToggleLoading = false
        })
        .catch(error => {
          this.error = error.response.data
          this.isToggleLoading = false
        })
    },

    updateTask () {
      if (this.isDisabled) {
        return false
      }

      this.isUpdateLoading = true
      this.error = null

      this.$store.dispatch('updateTask', {
        task: this.task,
        form: {
          title: this.form.title,
          due_at: this.form.due_at ? moment(this.form.due_at).format('YYYY-MM-DD HH:mm:ss') : null
        }
      })
        .then(data => {
          this.form.due_at = data.due_at

          this.isUpdateLoading = false
          this.editTask = false
        })
        .catch(error => {
          this.isUpdateLoading = false
          this.error = error.response.data
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

      this.$store.dispatch('removeTask', this.task)
        .catch(error => {
          this.error = error.response.data
        })
    },

    handleClickOutside () {
      this.error = null

      if (this.editTask && this.isNotLoading) {
        this.cancelEdit()
      }
    }
  }
}
</script>
