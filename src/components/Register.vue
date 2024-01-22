<template>
  <div class="d-flex justify-content-center align-items-center" style="height: 750px;">
    <form class="m-auto" @submit.prevent="handleSubmit">
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

<style>
</style>