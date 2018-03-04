import Vue from 'vue'
import App from './App.vue'

import 'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'
Vue.use(vueEventCalendar, {locale: 'ru', color: '#333'})

new Vue({
  el: '#app',
  render: h => h(App),
  data() { return {
    user: '',
    password: ''
  } }
})
