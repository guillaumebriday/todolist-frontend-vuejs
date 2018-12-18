<template>
  <li v-on-clickaway="handleClickAway" class="my-4">
    <task-form v-if="editTask" ref="taskForm" :form="form" :error="error" @submit="updateTask">
      <div class="flex items-center justify-between mt-2">
        <div class="flex items-center">
          <loading-button
            :is-loading="isUpdateLoading"
            :class="{'opacity-50 cursor-not-allowed' : isDisabled}"
            icon="check"
            class="btn-indigo text-sm"
            @click.native="updateTask"
          >
            Save
          </loading-button>

          <span class="ml-4 text-grey-darker text-sm cursor-pointer hover:underline" @click="cancelEdit">
            Cancel
          </span>
        </div>

        <loading-button
          :is-loading="isRemoveLoading"
          :class="[isRemoveLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline hover:text-red']"
          type="button"
          icon="trash"
          class="mx-4 text-grey-darker text-sm"
          @click.native="removeTask"
        >
          Delete
        </loading-button>
      </div>
    </task-form>

    <div v-else class="bg-white leading-none rounded-lg shadow overflow-hidden p-3 mb-4">
      <div class="flex items-center">
        <div class="flex-grow">
          <p class="font-semibold text-lg mx-2 text-left flex-auto cursor-pointer" :class="{'line-through text-grey' : task.is_completed}" @click="editTask = true">
            {{ task.title }}
          </p>

          <span v-if="task.due_at" :title="toDate" class="flex flex-no-shrink mr-2 mt-2 px-2 py-1 text-xs cursor-pointer" :class="[task.is_completed ? 'line-through text-grey' : 'text-grey-dark']" @click="editTask = true">
            <fa :icon="['far', 'clock']" class="mr-1" /> {{ fromNow }}
          </span>
        </div>

        <!-- Checkbox -->
        <div :class="[task.is_completed ? 'bg-indigo' : 'border-2', {'cursor-not-allowed' : isToggleLoading}]" class="rounded-full bg-white h-6 w-6 cursor-pointer flex items-center justify-center" @click="toggleCompleted">
          <fa v-if="isToggleLoading" icon="spinner" :class="[task.is_completed ? 'text-white' : 'text-indigo']" spin />
          <fa v-else icon="check" class="text-white" :class="{'hover:text-indigo' : ! task.is_completed}" />
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import moment from 'moment'
import Form from '@utils/Form'
import TaskForm from '@components/Tasks/TaskForm'

export default {
  components: {
    TaskForm
  },

  mixins: [ clickaway ],

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
      form: this.setForm(this.task)
    }
  },

  computed: {
    isDisabled () {
      return this.form.title === '' || this.isUpdateLoading
    },

    isNotLoading () {
      return !(this.isToggleLoading || this.isRemoveLoading || this.isUpdateLoading)
    },

    fromNow () {
      return moment(this.task.due_at).fromNow()
    },

    toDate () {
      return moment(this.task.due_at).format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
  },

  watch: {
    task () { this.form = this.setForm(this.task) }
  },

  methods: {
    toggleCompleted () {
      if (this.isToggleLoading) {
        return false
      }

      this.isToggleLoading = true
      this.error = null

      this.$store.dispatch('updateTask', {
        task: this.task,
        params: { is_completed: !this.task.is_completed }
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
        params: {
          title: this.form.title,
          due_at: moment(this.form.due_at).seconds(0)
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
      if (this.isRemoveLoading || !window.confirm('Are you sure ? Your task will be deleted forever.')) {
        return false
      }

      this.isRemoveLoading = true
      this.error = null

      this.$store.dispatch('removeTask', this.task)
        .catch(error => {
          this.error = error.response.data
        })
    },

    setForm (task) {
      return new Form({
        title: this.task.title,
        due_at: this.task.due_at
      })
    },

    handleClickAway () {
      this.error = null

      if (this.editTask && this.isNotLoading) {
        this.cancelEdit()
      }
    }
  }
}
</script>
