import Vue from 'vue';
import { rtdbPlugin } from 'vuefire';
import App from './App.vue';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

Vue.use(rtdbPlugin);

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
