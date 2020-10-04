require("./bootstrap");

window.Vue = require("vue");

import VueProgressBar from "vue-progressbar";

import { Form, HasError, AlertError } from "vform";
import Swal from 'sweetalert2'

Vue.use(VueProgressBar, {
    color: "rgb(52, 144, 220)",
    failedColor: "red",
    height: "5px",
    thickness: "3px"
});

window.Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})


Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

Vue.component("pagination", require("laravel-vue-pagination"));
Vue.component(
    "example-component",
    require("./components/ExampleComponent.vue").default
);

Vue.component(
    "product-component",
    require("./components/ProductComponent.vue").default
);
window.Form = Form;
window.Swal = Swal;

const app = new Vue({
    el: "#app"
});