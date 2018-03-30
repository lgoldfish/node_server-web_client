// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('es6-promise').polyfill();
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

import { Pagination, DatePicker } from "element-ui"
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.prototype.axios = axios

Vue.config.productionTip = false
// Vue.prototype.siteUrl = "http://10.0.10.13:3000/"
Vue.prototype.siteUrl = "http://101.201.56.245:3000/"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
