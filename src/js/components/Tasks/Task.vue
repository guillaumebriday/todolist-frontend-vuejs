<template>
  <li class="my-4">
    <on-click-outside :do="handleClickOutside">
      <form @submit.prevent="updateTask">
        <ul v-if="errors" class="bg-red-lightest border border-red-light text-red-dark px-6 py-3 rounded relative mb-3" role="alert">
          <li v-for="error in errors" :key="error[0]">{{ error[0] }}</li>
        </ul>

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
            <loading-button
              @click.native="updateTask"
              :isLoading="isUpdateLoading"
              :class="[isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-indigo hover:bg-white']"
              icon="fa-check"
              class="flex text-white border-2 border-indigo rounded-full bg-indigo uppercase px-3 py-2 text-xs font-bold no-outline align-middle cursor-pointer">
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
      errors: null,
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
      this.errors = null

      this.$store.dispatch('toggleCompleted', this.task)
        .then(() => {
          this.isToggleLoading = false
        })
        .catch(error => {
          this.errors = error.response.data.errors
          this.isToggleLoading = false
        })
    },

    updateTask () {
      if (this.isDisabled) {
        return false
      }

      this.isUpdateLoading = true
      this.errors = null

      if (this.form.due_at) {
        this.form.due_at = moment(this.form.due_at).format('YYYY-MM-DD HH:mm:ss')
      }

      this.$store.dispatch('updateTask', {
        task: this.task,
        form: this.form.data()
      })
        .then(data => {
          this.form.due_at = data.due_at

          this.isUpdateLoading = false
          this.editTask = false
        })
        .catch(error => {
          this.isUpdateLoading = false
          this.errors = error.response.data.errors
        })
    },

    cancelEdit () {
      this.editTask = false
      this.errors = null

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
      this.errors = null

      this.$store.dispatch('removeTask', this.task)
        .catch(error => {
          this.errors = error.response.data.errors
        })
    },

    handleClickOutside () {
      this.errors = null

      if (this.editTask && this.isNotLoading) {
        this.cancelEdit()
      }
    }
  }
}
</script>
