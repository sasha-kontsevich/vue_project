import { createApp } from "vue";
import App from "./App.vue";
// import router from "./router";
import store from "./store";
import mixin from "./mixins/main";

import "@/static/semantic.min.css";
import "@/styles/styles.scss";

window.$ = window.jQuery = require("jquery");
require("@/static/semantic.min");

createApp(App).use(store).mixin(mixin).mount("#app");
// createApp(App).use(store).use(router).mixin(mixin).mount("#app");