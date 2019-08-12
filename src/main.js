// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.min.css'

import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as uiv from 'uiv'

Vue.use(VueAxios, axios);
Vue.use(uiv);
Vue.config.productionTip = false

import CripLoading from "crip-vue-loading"

// Install component in to Vue instance and inject in to axios.
Vue.use(CripLoading, {axios})

Vue.prototype.$eventHub = new Vue(); // Global event bus

Vue.filter("date", function (val) {
  if (!val) return "";
  var dt = new Date(val);//.toString("yyyy-MM-dd");
  return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
});

Vue.filter('slugify', function slugify(text) {
  return (text || "").toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
});

//axios global interceptor
axios.interceptors.request.use(function (config) {
  const auth = localStorage.getItem("auth") || "";
  if (auth.length > 0) {
    config.headers = { Authorization: `Basic ${auth}` };
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if ( (error.response.status+"").startsWith("50")) {
    window.location = '/error';
  }
  if (400 == error.response.status) {
    window.location = '/';
  } else if ([401, 403].includes(error.response.status)) {
    localStorage.clear();
    window.location = '/login';
  } else {
    return Promise.reject(error);
  }
});
   
import store from '@/store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
