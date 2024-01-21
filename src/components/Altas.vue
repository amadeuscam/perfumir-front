<template>
  <div class="">
    <h1 class="mb-5">
      {{ status == "update" ? "Actualizar cliente" : "Añadir cliente" }}
      <span class="text-primary text-capitalize">{{ username }}</span>
    </h1>
    <Eror :error="error" />
    <form class="m-auto" @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="dni">Dni</label>
        <input
          type="text"
          class="form-control"
          id="dni"
          placeholder="x000000x"
          required
          v-model="dni"
        />
      </div>
      <div class="mb-3">
        <label for="Nombre">Nombre</label>
        <input
          type="text"
          class="form-control"
          id="Nombre"
          placeholder="juanito"
          required
          v-model="username"
        />
      </div>
      <div class="mb-3">
        <label for="prapellido">Primer Apellido</label>
        <input
          type="text"
          class="form-control"
          id="prapellido"
          placeholder="martinez"
          required
          v-model="firstLastName"
        />
      </div>
      <div class="mb-3">
        <label for="segapellido">Segundo Apellido</label>
        <input
          type="text"
          class="form-control"
          id="segapellido"
          placeholder="ortega"
          required
          v-model="secondLastName"
        />
      </div>

      <div class="mb-3">
        <label for="address">Direción</label>
        <input
          type="text"
          class="form-control"
          id="address"
          placeholder="calle de la vida sin numero"
          required
          v-model="address"
        />
      </div>
      <div class="d-flex justify-content-evenly align-items-around gap-3">
        <button class="w-100 btn btn-lg btn-dark  " @click.prevent="$router.go(-1)">
           Volver
        </button>
         
        <button class="w-100 btn btn-lg btn-primary  " type="submit">
          {{ status == "update" ? "Actualizar cliente" : "Añadir cliente" }}
        </button>
      
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useRoute } from "vue-router";
import Eror from "./Eror.vue";

export default {
  name: "Altas",
  components: { Eror },
  data() {
    return {
      dni: "",
      current_dni: "",
      username: "",
      firstLastName: "",
      secondLastName: "",
      address: "",
      error: "",
      status: "",
      listDni: [],
    };
  },
  created() {
    const route = useRoute();
    const id = route.query.update;
    if (id) {
      this.getCustomers();
      this.preloadCustomer(id);

      this.status = "update";
    } else {
      this.status = "create";
    }
  },
  methods: {
    async handleSubmit() {
      const data = {
        dni: this.dni,
        name: this.username,
        firstLastName: this.firstLastName,
        secondLastName: this.secondLastName,
        address: this.address,
      };
      //   console.log(data);
      const messge = {
        update: "Cliente actualizado correctamente",
        create: "Cliente añadido correctamente",
      };

      if (this.status == "update") {
        if (this.dni !== this.current_dni) {
          if (this.listDni.includes(this.dni)) {
            this.error = "Registro existente por DNI";
            this.$toast.error("Registro existente por DNI", {
              duration: 2000,
              dismissible: false,
            });
          }
          return;
        }
      }

      await axios({
        method: this.status == "update" ? "put" : "post",
        url: "api/v1/customers",
        data: data,
      })
        .then((res) => {
          //   console.log(res);
          this.$toast.success(messge[this.status], {
            duration: 2000,
          });
          setTimeout(() => {
            this.$router.push("/").then(() => {
              this.$router.go(0);
            });
          }, 2000);
        })
        .catch((error) => {
          //   console.log(error.response.data.message);
          this.error = error.response.data.message;
        });
    },
    async preloadCustomer(dni) {
      const data = {
        dni: this.dni,
        name: this.username,
        firstLastName: this.firstLastName,
        secondLastName: this.secondLastName,
        address: this.address,
      };

      await axios
        .get(`api/v1/customers/${dni}`)
        .then((res) => {
          const { dni, name, firstLastName, secondLastName, address } =
            res.data;
          this.dni = dni;
          this.current_dni = dni;
          this.username = name;
          this.firstLastName = firstLastName;
          this.secondLastName = secondLastName;
          this.address = address;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    async getCustomers() {
      await axios({
        method: "get",
        url: "api/v1/customers",
      })
        .then((res) => {
          this.listDni = res.data.map((x) => x["dni"]);
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
  },
};
</script>

<style>
</style>