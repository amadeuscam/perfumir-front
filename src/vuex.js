// Vue.use(Vuex);

// const store = createStore({
//   state() {
//     return {
//       username: "",
//     };
//   },
//   getters: {
//     username: (state) => {
//       return state.username;
//     },
//   },
//   actions: {
//     username({ commit }, username) {
//       commit("username", username);
//     },
//   },
//   mutations: {
//     username(state, username) {
//       state.username = username;
//     },
//   },
// });
// const pinia = createPinia()

// export default pinia;
// stores/counter.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("usuario", {
  state: () => {
    return { username: "" };
  },
  getters: {
    getUsername: (state) => {
      return state.username;
    },
  },

  actions: {
    setUsername(username) {
      this.username = username;
    },
  },
});
