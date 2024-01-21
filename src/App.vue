<template>
  <Nav />

  <div class="container min-vh-100" style="overflow: hidden">
    <!-- <Login /> -->
    <router-view></router-view>
  </div>
</template>
<script>
import Nav from "./components/Nav.vue";

export default {
  components: { Nav },
};
</script>

<style scoped>
</style>
