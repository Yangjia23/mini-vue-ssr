import Vue from 'vue'
import createRouter from './create-route'
import createStore from './create-store'
import App from './App.vue'

export default () => {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return {app, router, store} // 导出给 server.js 使用
}