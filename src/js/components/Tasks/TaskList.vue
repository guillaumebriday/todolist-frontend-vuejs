<template>
  <div>
    <div class="flex justify-center shadow">
      <router-link :class="[status === 'active' ? 'pill-active' : 'pill-inactive']" class="pill-default lg:flex-no-grow no-underline" :to="{name: 'TaskList', params: { status: 'active' }}" exact>
        Active ({{ activeTasks.length }})
      </router-link>

      <router-link :class="[status === 'all' ? 'pill-active' : 'pill-inactive']" class="pill-default lg:flex-no-grow no-underline" :to="{name: 'TaskList', params: { status: 'all' }}" exact>
        All ({{ allTasks.length }})
      </router-link>

      <router-link :class="[status === 'completed' ? 'pill-active' : 'pill-inactive']" class="pill-default lg:flex-no-grow no-underline" :to="{name: 'TaskList', params: { status: 'completed' }}" exact>
        Completed ({{ completedTasks.length }})
      </router-link>
    </div>

    <div class="container mx-auto mt-3 px-4">
      <div v-if="isLoading" class="text-xl text-center my-6 text-grey-darker">
        <fa icon="spinner" class="mr-1" spin />
        Loading
      </div>

      <transition-group class="list-reset relative" name="fade-out-left" tag="ul">
        <task v-for="task in tasks"
              :key="task.id"
              :task="task"
              class="animated task-item"
        />
      </transition-group>

      <new-task v-if="status != 'completed'" />

      <div v-else class="flex justify-end my-4">
        <loading-button
          v-if="completedTasks.length"
          :is-loading="isRemoveLoading"
          :class="[isRemoveLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline hover:text-red']"
          type="button"
          icon="trash"
          class="text-grey-darker text-sm"
          @click.native="deleteTasks"
        >
          Delete completed tasks
        </loading-button>
      </div>

      <div v-if="timeToChill" class="text-center mb-6">
        <p class="text-5xl">
          🍻
        </p>
        Time to chill ! You have no tasks
      </div>
    </div>
  </div>
</template>

<script>
import Task from '@components/Tasks/Task'
import NewTask from '@components/Tasks/NewTask'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    Task,
    NewTask
  },

  data () {
    return {
      isLoading: false,
      isRemoveLoading: false,
      isAnimated: true,
      initialTasks: []
    }
  },

  computed: {
    ...mapGetters([
      'allTasks',
      'activeTasks',
      'completedTasks'
    ]),

    tasks () {
      if (this.isAnimated) {
        return this.initialTasks
      }

      return this.filteredTasks
    },

    filteredTasks () {
      return this.$store.getters.filteredTasks(this.status)
    },

    status () {
      return this.$route.params.status
    },

    timeToChill () {
      if (this.isLoading) {
        return false
      }

      return this.$store.getters.timeToChill(this.status)
    }
  },

  watch: {
    status () {
      this.isAnimated = false
    }
  },

  mounted () {
    this.getTasks()

    if (window.Echo) {
      const userId = window.localStorage.getItem('userId')

      window.Echo.private(`App.User.${userId}`)
        .listen('TaskCreated', e => this.addTask(e.task))
        .listen('TaskUpdated', e => this.updateTask(e.task))
        .listen('TaskDeleted', e => this.removeTask(e.task))
        .listen('TasksDeleted', e => this.tasksDeleted())
    }
  },

  methods: {
    ...mapMutations([
      'addTask',
      'updateTask',
      'removeTask'
    ]),

    getTasks () {
      this.isLoading = true

      this.$store.dispatch('fetchTasks')
        .then(() => {
          this.isLoading = false
          this.setInitialTasks([...this.filteredTasks])
        })
    },

    setInitialTasks (tasks) {
      if (!tasks.length) {
        return false
      }

      let interval = null

      this.initialTasks.push(tasks.shift())

      interval = setInterval(() => {
        if (tasks.length > 0) {
          this.initialTasks.push(tasks.shift())
        } else {
          clearInterval(interval)
          this.isAnimated = false
        }
      }, 25)
    },

    deleteTasks () {
      if (this.isRemoveLoading || !window.confirm('Are you sure ? All your completed tasks will be deleted forever.')) {
        return false
      }

      this.isRemoveLoading = true

      this.$store.dispatch('deleteTasks')
        .then(() => {
          this.isRemoveLoading = false
        })
    },

    tasksDeleted () {
      this.completedTasks.forEach(task => this.removeTask(task))
    }
  }
}
</script>

<style lang="sass" scoped>
.fade-out-left-leave-active.task-item
  position: absolute
  left: 0
  right: 0
  margin: 0
</style>
