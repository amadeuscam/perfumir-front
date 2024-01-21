import { createApp } from "vue";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min";

import App from "./App.vue";

import "./axios";
import router from "./router";
// import useUserStore from "./vuex";

const app = createApp(App);

app.use(router);
app.use(ToastPlugin, {
  // One of the options
  position: "top-right",
});
// app.use(useUserStore);

app.mount("#app");

// createApp(App).mount('#app')
