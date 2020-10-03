require("./bootstrap");

window.Vue = require("vue");

import VueProgressBar from "vue-progressbar";

Vue.use(VueProgressBar, {
    color: "rgb(0, 255, 0)",
    failedColor: "red",
    height: "50px"
});

Vue.component("pagination", require("laravel-vue-pagination"));
Vue.component(
    "example-component",
    require("./components/ExampleComponent.vue").default
);

Vue.component(
    "product-component",
    require("./components/ProductComponent.vue").default
);

const app = new Vue({
    el: "#app"
});
