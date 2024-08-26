<template>
  <div
    class="d-flex justify-content-center align-items-center flex-column login_background"
    style="height: 100vh"
  >
    <Eror :error="error" />
    <form class="m-auto form-s" @submit.prevent="handleSubmit">
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

      <button class="w-100 btn btn-lg btn-dark" type="submit">
        Sign in
      </button>
    </form>
    <router-link to="/register" class="btn btn-success btn-large my-3">No estas registrado?</router-link>
  </div>
</template>

<script>
import customAxios from '../axios';
import Eror from "./Eror.vue";

export default {
  name: "Login",
  components: { Eror },
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async handleSubmit() {
      await customAxios
        .post("api/auth/signin", {
          email: this.username,
          password: this.password,
        })
        .then((res) => {
          console.log(res);
          const { token, refreshToken } = res.data;

          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          const sub = this.decodeJwt(token);
          localStorage.setItem("current_user", this.decodeJwt(token));
          // this.$store.commit('username',sub)
          this.$router.push("/ingredients").then(() => {
            this.$router.go(0);
          });
        })
        .catch((error) => {
          console.log(error);
          
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
.login_background  {
  background-image: url("https://images.unsplash.com/photo-1543157145-f78c636d023d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-repeat: no-repeat;
  background-size: cover;
}
.form-s {
  background-color: #ffffff73;
  border-radius: 5%;
  padding: 20px 30px;
  
}
.form-s h1 {
  
    font-size: 2.4em;
    text-align: center;
  
}
</style>