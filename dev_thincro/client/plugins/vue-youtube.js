import Vue from 'vue'
import VueYoutube from 'vue-youtube'

Vue.prototype.$vue_test = (str) => {
    console.log('plugin met' + str)
}
Vue.use(VueYoutube)
