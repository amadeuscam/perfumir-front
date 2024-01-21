<template>
  <div class="alert alert-danger" role="alert" v-if="error">
    {{ error }}
  </div>
</template>

<script>
export default {
  props: ["error"],
};
</script>

<style>
</style>