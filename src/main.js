import Vue from 'vue'
import VueToast from 'vue-toast-notification'

import App from './App.vue'

import './assets/main.css'

Vue.use(VueToast)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
