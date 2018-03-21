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
        <input type="radio"  v-model="check" class="hidden" value="completed"> Done ({{ completedTasks.length }})
      </label>
    </div>

    <div class="container mx-auto mt-3 px-4">
      <task-form v-if="check != 'completed'" @created="addTask"></task-form>

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
      check: 'active'
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
      return this.check === 'active' && !this.activeTasks.length
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
    }
  }
}
</script>
