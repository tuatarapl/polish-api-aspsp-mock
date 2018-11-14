import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { confirmation } from './routes/confirmation'
import { login, loginGuard } from './routes/login'
import { psu } from './routes/psu'
Vue.use(VueRouter)
const routes: RouteConfig[] = [
  ...confirmation,
  login,
  ...psu
]

const router = new VueRouter({
  mode: 'history',
  routes,
  linkActiveClass: 'active'
})
router.beforeEach(loginGuard)

export default router
