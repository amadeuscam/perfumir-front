<template>
  <div class="d-flex justify-content-center align-items-center flex-column login_background" style="height: 100vh">
    <form class="m-auto form-s" @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Registrar</h1>

      <div class="mb-3">
        <label for="floatingPassword">Nombre</label>
        <input
          type="text"
          v-model="username"
          class="form-control"
          id="floatingInput"
          required
          placeholder="juanito"
        />
      </div>
      <div class="mb-3">
        <label for="floatingPassword">Contraseña</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          id="floatingPassword"
          placeholder="****"
          required
        />
      </div>

      <div class="mb-3">
        <label for="floatingPassword">Confirmar Contraseña</label>
        <input
          type="password"
          v-model="password_confirm"
          class="form-control"
          id="floatingPassword"
          placeholder="****"
          required
        />
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">
        Registrar
      </button>
    </form>
    <router-link to="/login" class="btn btn-dark btn-large my-3">Ya estas registrado?</router-link>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      password_confirm: "",
    };
  },
  methods: {
    async handleSubmit() {
      await axios
        .post("auth/register", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.status == 200) {
            this.$router.push("/login")
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
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