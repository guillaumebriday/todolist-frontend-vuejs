<template>
  <div>
    <navbar></navbar>

    <div class="flex justify-center shadow">
      <router-link :class="[status === 'active' ? 'pill-active' : 'pill-inactive']" class="pill-default lg:flex-no-grow no-underline" :to="{name: 'TaskList', params: { status: 'active' }}" exact>
        Active ({{ activeTasks.length }})
      </router-link>

      <router-link :class="[status === 'all' ? 'pill-active' : 'pill-inactive']" class="pill-default lg:flex-no-grow no-underline" :to="{name: 'TaskList', params: { status: 'all' }}" exact>
        All ({{ tasks.length }})
      </router-link>

      <router-link :class="[status === 'completed' ? 'pill-active' : 'pill-inactive']" class="pill-default lg:flex-no-grow no-underline" :to="{name: 'TaskList', params: { status: 'completed' }}" exact>
        Completed ({{ completedTasks.length }})
      </router-link>
    </div>

    <div class="container mx-auto mt-3 px-4">
      <div v-if="isLoading" class="text-xl text-center my-6 text-grey-darker">
        <i class="fa fa-spinner fa-spin mr-1" aria-hidden="true"></i>
        Loading
      </div>

      <transition-group class="list-reset" name="list" tag="ul">
        <task v-for="task in filteredTasks"
              :key="task.id"
              :task="task"
              @updated="updateTask"
              @deleted="removeTask">
        </task>
      </transition-group>

      <task-form v-if="status != 'completed'" @created="addTask"></task-form>

      <div v-else class="flex justify-end">
        <loading-button
          v-if="completedTasks.length"
          @click.native="deleteTasks"
          :isLoading="isRemoveLoading"
          :class="[isRemoveLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline hover:text-red']"
          type="button"
          icon="fa-trash"
          class="mx-4 text-grey-darker text-sm">
            Delete completed tasks
        </loading-button>
      </div>

      <div v-if="timeToChill" class="text-center mb-6">
        <p class="text-5xl">🍻</p>
        Time to chill ! You have no tasks
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@components/Navbar'
import Task from '@components/Tasks/Task'
import TaskForm from '@components/Tasks/TaskForm'

export default {
  components: {
    Navbar,
    Task,
    TaskForm
  },

  data () {
    return {
      tasks: [],
      isLoading: false,
      isRemoveLoading: false
    }
  },

  computed: {
    status () {
      return this.$route.params.status
    },

    filteredTasks () {
      if (this.status === 'completed') {
        return this.completedTasks
      } else if (this.status === 'active') {
        return this.activeTasks
      }

      return this.tasks
    },

    completedTasks () {
      return this.tasks.filter(task => task.is_completed === true)
    },

    activeTasks () {
      return this.tasks.filter(task => task.is_completed === false)
    },

    timeToChill () {
      if (this.isLoading) {
        return false
      }

      return !this.tasks.length ||
             (this.status === 'active' && !this.activeTasks.length) ||
             (this.status === 'completed' && !this.completedTasks.length)
    }
  },

  mounted () {
    let userId = window.localStorage.getItem('userId')

    this.getTasks()

    if (window.Echo) {
      window.Echo.private(`App.User.${userId}`)
        .listen('TaskCreated', e => this.addTask(e.task))
        .listen('TaskUpdated', e => this.updateTask(e.task))
        .listen('TaskDeleted', e => this.removeTask(e.task))
        .listen('TasksDeleted', e => this.tasksDeleted())
    }
  },

  methods: {
    getTasks () {
      this.isLoading = true

      window.axios.get('/tasks')
        .then(response => {
          this.isLoading = false

          this.tasks.push(...response.data.data)
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    addTask (task) {
      this.tasks.push(task)
    },

    updateTask (task) {
      let taskId = task.id
      this.tasks.splice(this.tasks.findIndex(task => task.id === taskId), 1, task)
    },

    removeTask (task) {
      let taskId = task.id
      this.tasks.splice(this.tasks.findIndex(task => task.id === taskId), 1)
    },

    tasksDeleted () {
      this.completedTasks.forEach(task => this.removeTask(task))
    },

    deleteTasks () {
      if (this.isRemoveLoading || !window.confirm('Are you sure ? All your completed tasks will be deleted forever.')) {
        return false
      }

      this.isRemoveLoading = true

      window.axios.delete('/tasks')
        .then(response => {
          this.tasksDeleted()
          this.isRemoveLoading = false
        })
        .catch(() => {
          this.isRemoveLoading = false
        })
    }
  }
}
</script>

<style lang="sass" scoped>
  .list-item
    display: inline-block
    margin-right: 10px

  .list-enter-active,
  .list-leave-active
    transition: all .3s

  .list-enter,
  .list-leave-to
    opacity: 0
    transform: translateX(30px)
</style>
