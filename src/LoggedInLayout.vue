<template>
    <div class="min-vh-100">
      <Nav />
  
      <div class="container-fluid" style="overflow: hidden">
        <router-view></router-view>
      </div>
    </div>
  </template>
  <script>
  import Nav from "./components/Nav.vue";
  
  export default {
    components: { Nav },
  };
  </script>
  
  <style scoped></style>
  