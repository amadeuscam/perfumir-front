<template>
  <div class="d-flex justify-content-center align-items-center flex-column" style="height: 750px;">
   <Eror :error="error" />
    <form class="m-auto" @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Login</h1>

      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          id="floatingInput"
          placeholder="juanito"
          required
          v-model="username"
        />
      </div>
      <div class="mb-3">
        <label for="floatingPassword">Contraseña</label>
        <input
          type="password"
          class="form-control"
          id="floatingPassword"
          placeholder="****"
          required
          v-model="password"
        />
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">
        Sign in
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Eror from './Eror.vue';

export default {
  name: "Login",
  components:{Eror},
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async handleSubmit() {
      await axios
        .post("auth/login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          const { token } = res.data;

          localStorage.setItem("token", token);
          const sub = this.decodeJwt(token);
          localStorage.setItem("current_user", this.decodeJwt(token));
          // this.$store.commit('username',sub)
          this.$router.push("/").then(() => { this.$router.go(0) });
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    decodeJwt(token) {
      const claims = atob(token.split(".")[1]);
      const { sub } = JSON.parse(claims);
      return sub;
    },
  },
};
</script>

<style>
</style>