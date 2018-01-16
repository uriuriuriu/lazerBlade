// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import './elementVar.sass'
import App from 'src/App'
import VueResource from 'vue-resource'
// import glsl from 'src/shaders/index'
import WindowStatePlugin from 'src/plugins/windowStatePlugin'
import router from 'src/router/router'
import store from 'src/vuex/store'
import { sync } from 'vuex-router-sync'

Vue.use(ElementUI, {locale})
Vue.use(WindowStatePlugin)
// Vue.use(glsl)
Vue.use(VueResource)
// for cors
Vue.http.interceptors.push((request, next) => {
  if (!/https:\/\/api.github.com/.test(request.url)) {
    request.credentials = true
  }
  next()
})
// sync store and router state
sync(store, router)

/* eslint-disable no-new */
new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
