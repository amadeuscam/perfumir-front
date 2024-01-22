<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light vh-10">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Navbar</a>
      <ul class="navbar-nav ms-xl-auto">
        <li class="nav-item">
          <router-link class="nav-link active" to="/">Home</router-link>
        </li>
      </ul>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-xl-auto mb-2 mb-lg-0" v-if="!username">
          <li class="nav-item">
             
            <router-link class="nav-link active" to="/login">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Registrar</router-link>
          </li>
        </ul>

        <ul class="navbar-nav ms-xl-auto mb-2 mb-lg-0" v-if="username">
          <li class="nav-item">
            <p class="nav-link fw-bold text-capitalize">{{ username }}</p>
          </li>
          <li class="nav-item">
            <a class="nav-link text-danger" style="cursor: pointer;" @click="handleClick"
              >Salir</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      username: "",
    };
  },
  created() {
    this.username = localStorage.getItem("current_user");
  },
 
  methods: {
    handleClick() {
      localStorage.removeItem("token");
      localStorage.removeItem("current_user");
      this.$router.push("/").then(() => { this.$router.go(0) });
    },
  },
};
</script>

<style>
</style>