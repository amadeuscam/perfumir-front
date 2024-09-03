<template>
  <div class="container-fluid mt-5">
    <h1 class="mb-3 text-center">
      {{ status == "update" ? "Update   " + name : "Add ingrediente" }}
    </h1>

    <button class="btn btn-md btn-dark mb-3" @click.prevent="$router.go(-1)">Volver</button>

    <Eror :error="error" />
    <div class="row">
      <form class="m-auto col-8" @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-12 col-md-8">
            <div class="row">
              <div class="col-12 col-md-4">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="name" placeholder="coumarin" required v-model="name" />
                  <label for="name">Name</label>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="casNumber" placeholder="91-64-5" required v-model="casNumber" />
                  <label for="casNumber">Cas Number</label>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="form-floating mb-3">
                  <select class="form-select" id="priamidLevels" v-model="priamidLevel" aria-label="Floating label select example">
                    <option value="top">Top</option>
                    <option value="heart">Heart</option>
                    <option value="base">Base</option>
                  </select>
                  <label for="priamidLevels">Piramid Level</label>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="form-floating mb-3">
                  <select class="form-select" id="type" v-model="type" aria-label="Floating label select example">
                    <option value="syntetic">Syntetic</option>
                    <option value="eo">Eo</option>
                  </select>
                  <label for="type">Type</label>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="form-floating mb-3">
                  <input type="number" class="form-control" id="odorImpact" placeholder="50" required v-model="odorImpact" />
                  <label for="odorImpact">Odor Impact</label>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="form-floating mb-3">
                  <input type="number" class="form-control" id="odorLife" placeholder="50" required v-model="odorLife" />
                  <label for="odorLife">Odor Life</label>
                </div>
              </div>

              <div class="col-12 col-md-8">
                <!-- <label for="segapellido">Segundo Apellido</label> -->
                <div class="form-floating mb-3">
                  <textarea class="form-control" style="height: 130px" placeholder="Coumarin is sweet aromatic coconut herbaceous-warm spicy" id="odorDescription" v-model="odorDescription"></textarea>
                  <label for="odorDescription">Odor Description</label>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="ifra" placeholder="50" v-model="ifra" />
                  <label for="ifra">Ifra Limit</label>
                </div>
              </div>


            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-floating mb-3">
                  <select class="form-select" style="height: 30vh; overflow-y: auto" id="dilutions" v-model="dilutions" multiple aria-label="Floating label select example">
                    <option :value="dilution" v-for="dilution in preloadData.dilutions" :key="dilution.id">
                      {{ dilution }}
                    </option>
                  </select>
                  <label for="dilutions">Dilutions</label>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-floating mb-3">
                  <select class="form-select" id="olfactoryFamily" v-model="olfactiveFamilies" style="height: 30vh; overflow-y: auto" multiple aria-label="Floating label select example">
                    <option :value="olfactiveFamily" v-for="(olfactiveFamily, index) in preloadData.olfactiveFamilies" :key="index">
                      {{ olfactiveFamily }}
                    </option>
                  </select>
                  <label for="olfactoryFamily">Olfactory Family</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-evenly align-items-around gap-3">
          <button class="w-100 btn btn-lg btn-outline-success" type="submit">
            {{ status == "update" ? "Actualizar" : "Añadir" }}
          </button>
        </div>
      </form>

      <div class="col-12 col-md-4 mt-5 mt-md-0" style="position: relative">
        <div class="col-12 d-flex justify-content-evenly">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="olfactoryFamilyAdd" placeholder="Marine" required v-model="olfactoryFamilyAdd" />
            <label for="olfactoryFamilyAdd">Olfactory Family To Add</label>
          </div>
          <button class="btn btn-md btn-outline-success mb-3 px-5" @click.prevent="addolfactoryFamily()">Add</button>
        </div>

        <div class="col-12 d-flex justify-content-evenly">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="dilutionAdd" placeholder="Marine" required v-model="dilutionAdd" />
            <label for="dilutionAdd">Dilution to Add</label>
          </div>
          <button class="btn btn-md btn-outline-success mb-3 px-5" @click.prevent="addDilution()">Add</button>
        </div>

        <div class="col-12 d-flex justify-content-center mt-5">
          <button class="btn btn-lg btn-outline-danger" v-if="status == 'update'" style="position: absolute; bottom: 0" @click.prevent="deleteIngredient()">Delete {{ name }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import customAxios from "../../axios";
import Eror from "../Eror.vue";

export default {
  // name: "Create Ingredient",
  components: { Eror },

  data() {
    return {
      name: "",
      casNumber: "",
      priamidLevel: "",
      odorDescription: "",
      type: "",
      odorImpact: null,
      error: "",
      odorLife: null,
      ifra: null,
      dilutions: [],
      olfactiveFamilies: [],
      olfactoryFamilyAdd: "",
      dilutionAdd: null,
      preloadData: {
        dilutions: [],
        olfactiveFamilies: [],
      },
      id: null,
    };
  },
  created() {
    const route = useRoute();
    this.id = route.params.id;
    // console.log(route);
    if (this.id) {
      // this.getCustomers();
      // this.preloadCustomer(id);
      this.getIngredient(this.id);
      this.status = "update";
    } else {
      this.status = "create";
    }
    this.getDilutions();
    this.getOlfactoryFamily();
  },
  methods: {
    async handleSubmit() {
      const data = {
        name: this.name,
        casNumber: this.casNumber,
        pyramidLevel: this.priamidLevel,
        odorDescription: this.odorDescription,
        type: this.type,
        ifra: this.ifra,
        odorImpact: this.odorImpact,
        odorLife: this.odorLife,
        dilutions: this.dilutions.map((e) => {
          return { quantity: e };
        }),
        olfactiveFamilies: this.olfactiveFamilies.map((e) => {
          return { name: e };
        }),
      };

      if (this.id) {
        data["id"] = this.id;
      }

      const messge = {
        update: "Ingediente actualizado correctamente",
        create: "Ingediente añadido correctamente",
      };

      console.log(data);
      // return;

      const actions = {
        update: {
          method: "put",
          url: `api/v1/ingredients`,
        },
        create: {
          method: "post",
          url: `api/v1/ingredients`,
        },
      };

      await customAxios({
        method: actions[this.status].method,
        url: actions[this.status].url,
        data: data,
      })
        .then((res) => {
          // console.log(res);
          this.$toast.success(messge[this.status], {
            duration: 2000,
          });
          setTimeout(() => {
            this.$router.push("/ingredients").then(() => {
              this.$router.go(0);
            });
          }, 2000);
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },

    async getDilutions() {
      await customAxios({
        method: "get",
        url: "api/v1/dilutions/dilution-list",
      })
        .then((res) => {
          this.preloadData.dilutions = res.data;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },

    async getOlfactoryFamily() {
      await customAxios({
        method: "get",
        url: "api/v1/olfative-families/unique",
      })
        .then((res) => {
          // console.log(res);
          this.preloadData.olfactiveFamilies = res.data;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    addolfactoryFamily() {
      if (this.olfactoryFamilyAdd.length == 0) {
        return;
      }
      this.preloadData.olfactiveFamilies.push(this.olfactoryFamilyAdd);

      this.olfactoryFamilyAdd = "";
    },
    addDilution() {
      if (this.dilutionAdd == null ||  isNaN(parseInt(this.dilutionAdd)))  {
        return;
      }

      this.preloadData.dilutions.push(this.dilutionAdd);

      this.dilutionAdd = null;
    },
    async getIngredient(id) {
      await customAxios({
        method: "get",
        url: `api/v1/ingredients/${id}`,
      })
        .then((res) => {
          console.log(res);
          this.name = res.data.name;
          this.casNumber = res.data.casNumber;
          this.odorDescription = res.data.odorDescription;
          this.odorImpact = res.data.odorImpact;
          this.odorLife = res.data.odorLife;
          this.ifra = res.data.ifra;
          this.priamidLevel = res.data.pyramidLevel;
          this.type = res.data.type;

          this.dilutions = res.data.dilutions.map((d) => d.quantity);
          this.olfactiveFamilies = res.data.olfactiveFamilies.map((d) => d.name);
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    async deleteIngredient() {
      await customAxios({
        method: "delete",
        url: `api/v1/ingredients/${this.id}`,
      })
        .then((res) => {
          // console.log(res);
          this.$toast.success("Ingediente eliminado correctamente", {
            duration: 2000,
          });
          setTimeout(() => {
            this.$router.push("/ingredients").then(() => {
              this.$router.go(0);
            });
          }, 2000);
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
  },
};
</script>

<style></style>
