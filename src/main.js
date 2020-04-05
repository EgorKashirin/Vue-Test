import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from "bootstrap-vue"
import VueResource from 'vue-resource'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "../src/assets/icon.png"

Vue.use(VueResource)
Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
