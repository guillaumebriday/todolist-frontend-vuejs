<template>
  <div>
    <div class="flex justify-center shadow px-8">
      <label :class="[check === 'active' ? 'pill-active' : 'pill-inactive']" class="pill-default">
        <input type="radio" v-model="check" class="hidden" value="active">Active ({{ activeTasks.length }})
      </label>

      <label :class="[check === 'all' ? 'pill-active' : 'pill-inactive']" class="pill-default">
        <input type="radio" v-model="check" class="hidden" value="all">All ({{ tasks.length }})
      </label>

      <label :class="[check === 'completed' ? 'pill-active' : 'pill-inactive']" class="pill-default">
        <input type="radio"  v-model="check" class="hidden" value="completed"> Completed ({{ completedTasks.length }})
      </label>
    </div>

    <div class="container mx-auto mt-3 px-4">
      <task-form v-if="check != 'completed'" @created="addTask"></task-form>

      <div v-else class="flex justify-end">
        <div v-if="completedTasks.length" @click="deleteTasks" :class="[isRemoveLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline hover:text-red']" class="mx-4 text-grey-darker text-sm">
          <i v-if="isRemoveLoading" class="fa fa-spinner fa-spin mr-1" aria-hidden="true"></i>
          <i v-else class="fa fa-trash mr-1" aria-hidden="true"></i> Delete completed tasks
        </div>
      </div>

      <div v-if="timeToChill" class="text-center mt-6">
        <p class="text-5xl">🍻</p>
        Time to chill ! You have no tasks
      </div>

      <ul class="list-reset">
        <task v-for="task in filteredTasks"
              :key="task.id"
              :task="task"
              @updated="updateTask"
              @deleted="removeTask">
        </task>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tasks: [],
      check: 'active',
      isRemoveLoading: false
    }
  },

  computed: {
    filteredTasks () {
      if (this.check === 'completed') {
        return this.completedTasks
      } else if (this.check === 'active') {
        return this.activeTasks
      }

      return this.tasks
    },

    completedTasks () {
      return this.tasks.filter(task => task.deleted_at !== null)
    },

    activeTasks () {
      return this.tasks.filter(task => task.deleted_at === null)
    },

    timeToChill () {
      return !this.tasks.length || (this.check === 'completed' && !this.completedTasks.length)
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
      window.axios.get('/tasks').then(response => {
        this.tasks.push(...response.data.data)
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
