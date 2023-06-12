/*
 * @Description: 
 * @Autor: qsyj
 * @Date: 2023-05-19 21:45:56
 * @LastEditors: qsyj
 * @LastEditTime: 2023-05-20 16:55:11
 */
import Vue from "vue";
import App from "./App.vue"
import './style.css'



const app =  new Vue({
    el: "#app",
    render: (h) => h(App)
}).$mount();

