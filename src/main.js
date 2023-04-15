import Vue from 'vue'
import VueToast from 'vue-toast-notification'

import App from './App.vue'
import store from './store'

import './assets/main.css'

Vue.use(VueToast)

new Vue({
  data: store,
  render: (h) => h(App)
}).$mount('#app')
