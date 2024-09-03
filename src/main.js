import { createApp } from "vue";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min";

import App from "./App.vue";
import "./axios";
import router from "./router";
// import useUserStore from "./vuex";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as RemixIcons from "oh-vue-icons/icons";
const rem = Object.values({ ...RemixIcons });
addIcons(...rem);
const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.use(router);
app.use(ToastPlugin, {
  // One of the options
  position: "top-right",
});
// app.use(useUserStore);

app.mount("#app");

// createApp(App).mount('#app')
