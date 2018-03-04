import VueRouter from 'vue-router'
import store from '../store'
import TaskList from '../components/Tasks/TaskList'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

let router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'TaskList',
      component: TaskList,
      meta: {auth: true}
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {auth: false}
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {auth: false}
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!store.getters.isLogged && to.meta.auth) {
    return next('/login')
  }

  if (store.getters.isLogged && to.name === 'Login') {
    return next('/')
  }

  next()
})

export default router
