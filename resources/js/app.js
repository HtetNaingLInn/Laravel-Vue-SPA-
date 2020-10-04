require("./bootstrap");

window.Vue = require("vue");

import VueProgressBar from "vue-progressbar";

import { Form, HasError, AlertError } from "vform";
Vue.use(VueProgressBar, {
    color: "rgb(0, 255, 0)",
    failedColor: "red",
    height: "50px"
});

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

const app = new Vue({
    el: "#app"
});