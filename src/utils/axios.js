import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios