import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueAxios from "vue-axios";
import axios from "axios";
import "@/components";
import installAxiosInterceptor from './installAxiosInterceptor';
import "./installBottomScrollUpEvents";
const VuePickerMobile = require('@/package');
import { RadioGroup, Radio } from 'vant';
import 'vant/lib/index.css';

Vue.use(Radio);
Vue.use(RadioGroup);

Vue.config.productionTip = false;

installAxiosInterceptor(axios);
Vue.use(VueAxios, axios);
Vue.use(VuePickerMobile.default)


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
