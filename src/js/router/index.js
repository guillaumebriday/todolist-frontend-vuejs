import VueRouter from 'vue-router'
import store from '../store'
import Home from '../components/Home'
import Login from '../components/Login'

let router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {auth: true}
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
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
