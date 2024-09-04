<template>
  <div class="d-flex justify-content-center align-items-center flex-column login_background" style="height: 100vh">
    <form class="m-auto form-s" @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Register</h1>

      <div class="mb-3">
        <label for="floatingPassword">Email</label>
        <input type="text" v-model="storage.username" class="form-control" id="floatingInput" required placeholder="juanito" />
      </div>
      <div class="mb-3">
        <label for="floatingPassword">FirstName</label>
        <input type="text" v-model="storage.firstName" class="form-control" id="floatingPassword" placeholder="****" required />
      </div>
      <div class="mb-3">
        <label for="floatingPassword">LastName</label>
        <input type="text" v-model="storage.lastName" class="form-control" id="floatingPassword" placeholder="****" required />
      </div>
      <div class="mb-3">
        <label for="floatingPassword">Password</label>
        <input type="password" v-model="storage.password" class="form-control" id="floatingPassword" placeholder="****" required />
      </div>

      <div class="mb-3">
        <label for="floatingPassword">Confirm Password</label>
        <input type="password" v-model="storage.password_confirm" class="form-control" id="floatingPassword" placeholder="****" required />
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">Register</button>
    </form>
    <router-link to="/login" class="btn btn-dark btn-large my-3">¿Are you register?</router-link>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import customAxios from "../axios";
const router = useRouter();

const toast = useToast();

const storage = reactive({
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  password_confirm: null,
});

const handleSubmit = async () => {
  await customAxios
    .post("api/auth/signup", {
      email: storage.username,
      password: storage.password,
      firstName: storage.firstName,
      lastName: storage.lastName,
      role: "admin",
    })
    .then((res) => {
      if (res.status == 201) {
        toast.success("User created successfuly!!", {
          duration: 5000,
          position: "top-right",
        });
        router.push("/login");
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error("User not created or incorrectly entered data!!", {
        duration: 5000,
        position: "top-right",
      });
    });
};
</script>

<style scoped>
.login_background {
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
