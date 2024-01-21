import Altas from "./components/Altas.vue";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    component: Home,
    meta: {
      requiresAuth: true, // Add meta field to indicate protected route
    },
  },
  {
    path: "/altas",
    component: Altas,
    meta: {
      requiresAuth: true, // Add meta field to indicate protected route
    },
  },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from,next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      // User is authenticated, proceed to the route
      next();
    } else {
      // User is not authenticated, redirect to login
      next("/login");
    }
  } else {
    // Non-protected route, allow access
    next();
  }
});

export default router;
