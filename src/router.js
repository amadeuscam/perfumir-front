import { createRouter, createWebHistory } from "vue-router";
import LoggedInLayout from "./LoggedInLayout.vue";
import CreateIngredient from "./components/IngredientsManagement/CreateIngredient.vue";
import Ingredients from "./components/IngredientsManagement/Ingredients.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Formula from "./components/projects/Formula.vue";
import FormulaView from "./components/projects/FormulaView.vue";
import Project from "./components/projects/Project.vue";
import Recognition from "./views/Recognition.vue";
const routes = [
  { path: "/login", component: Login, meta: { title: "Login" } },
  { path: "/register", component: Register, meta: { title: "Register" } },

  {
    path: "/",
    component: LoggedInLayout,
    redirect: "/ingredients",
    meta: {
      requiresAuth: true, // Add meta field to indicate protected route
    },
    children: [
      {
        path: "/ingredients",
        component: Ingredients,
        meta: { title: "Ingredients" },
      },{
        path: "/recognition",
        component: Recognition,
        meta: { title: "Recognition" },
      },
      {
        path: "/ingredients/actions/:id?",
        component: CreateIngredient,
        meta: { title: "Create Ingredient" },
      },
      {
        path: "/projects/:id?",
        component: Project,
        meta: { title: "Projects" },
      },
      {
        path: "/formula/:id?",
        component: Formula,
        meta: { title: "Formula" },
      },
      {
        path: "/formula/copy/:fmanagementId/:formulaId",
        component: Formula,
        meta: { title: "Copy Formula" },
      },
      {
        path: "/formula/:project_id/formulaview/:formula_id",
        component: FormulaView,
        meta: { title: "Formula versions" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
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
