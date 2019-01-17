import VueRouter from 'vue-router'
import store from '@store'
const Home = () => import('@components/Home')
const Login = () => import('@components/Auth/Login')
const Register = () => import('@components/Auth/Register')
const TaskList = () => import('@components/Tasks/TaskList')
const Profile = () => import('@components/Users/Profile')
const Security = () => import('@components/Users/Security')
const Settings = () => import('@components/Users/Settings')

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { auth: false }
    },
    {
      path: '/settings',
      component: Settings,
      children: [
        {
          path: 'profile',
          name: 'Profile',
          meta: { auth: true },
          component: Profile
        },
        {
          path: 'security',
          name: 'Security',
          meta: { auth: true },
          component: Security
        }
      ]
    },
    {
      path: '/app/:status',
      name: 'TaskList',
      component: TaskList,
      meta: { auth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { auth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { auth: false }
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

  if (store.getters.isLogged && !to.meta.auth) {
    return next('/app/active')
  }

  next()
})

export default router
