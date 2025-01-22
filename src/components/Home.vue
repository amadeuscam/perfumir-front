<template>
  <div class="">
    <!-- <button class="btn btn-primary">Alta</button> -->
    <!-- <router-link to="altas" class="btn btn-dark btn-large my-3"
      >Alta Clientes</router-link
    > -->

    <div class="input-group mb-3">
      <span class="input-group-text" id="basic-addon1">@</span>
      <input type="text" class="form-control" placeholder="Buscar por nombre" aria-label="Username" v-model="search"
        aria-describedby="basic-addon1" />
    </div>

    <div class="" v-if="cunstomers">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Dni</th>
            <th scope="col">Nombre</th>
            <th scope="col">Primer Apellido</th>
            <th scope="col">Segundo Apellido</th>
            <th scope="col">Dirección</th>
            <th scope="col">Acctiones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in filteredList" :key="index">
            <th scope="row">{{ customer.dni }}</th>
            <td>{{ customer.name }}</td>
            <td>{{ customer.firstLastName }}</td>
            <td>{{ customer.secondLastName }}</td>
            <td>{{ customer.address }}</td>
            <td class="d-flex justify-content-evenly align-items-around">
              <button class="btn btn-primary" @click="handleUpdate(customer.dni)">
                Edit
              </button>
              <button class="btn btn-danger mr-2" @click="handleDelete(customer.dni)">
                Borrar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      cunstomers: null,
      search: "",
    };
  },
  computed: {
    filteredList() {
      return this.cunstomers.filter((customer) => {
        return customer.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  async created() {
    await axios
      .get("api/v1/customers")
      .then((res) => {
        this.cunstomers = res.data.content;
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  },

  methods: {
    handleUpdate(dni) {
      this.$router.push({ path: "/altas", query: { update: dni } });
    },
    async handleDelete(dni) {
      await axios
        .delete(`api/v1/customers/${dni}`)
        .then((res) => {
          this.cunstomers = this.cunstomers.filter(function (e) {
            return e.dni !== dni;
          });
          this.$toast.success("Cliente eliminado correctamente!", {
            duration: 2000,
          });
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },
  },
};
</script>

<style></style>