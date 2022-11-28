import Vue from "vue";
import App from "./App.vue"
import './style.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';



const app =  new Vue({
    el: "#app",
    render: (h) => h(App)
}).$mount();
Vue.use(ElementUI)
