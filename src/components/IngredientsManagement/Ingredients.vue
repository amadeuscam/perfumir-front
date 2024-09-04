<template>
  <router-link to="/ingredients/actions" class="btn btn-dark btn-large my-3">New Ingredient</router-link>
  <Eror :error="error" />

  <div class="row">
    <div class="col-12 col-md-2">
      <div class="row">
        <div class="col-12 col-md-12">
          <div class="col-12 col-md-12">
            <input type="search" v-model="searchField" class="form-control" placeholder="Search ingredients..." />
          </div>
          <!-- <div class="col-12 col-md-12 mt-5">
            <button class="btn btn-md btn-dark mb-3" @click.prevent="downloadIngredients()">Dowload Ingredientes</button>
          </div> -->
          <div class="col-12 col-md-12 mt-3">
            <h4 style="margin-right: 15px; text-align: center">Dilutions</h4>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Dilution</th>
                  <th scope="col">Quanities</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stat, index) in stats" :key="index">
                  <td scope="row">{{ stat.quantity }}</td>
                  <td>{{ stat.count }}</td>
                </tr>
              </tbody>
            </table>
            <!--
            <h6 
              style="margin-right: 10px; font-weight: bold; font-size: 2.3rem">
              {{ stat.quantity }}<span class="badge " style="font-size: 0.4em; background-color: #ff0; color: #000">{{
                stat.count }}</span>
            </h6> -->
          </div>
          <div class="col-12 col-md-12 mt-3">
            <h4 class="text-center m-4">Piramid Level</h4>
            <div class="row">
              <div class="col mb-3"><span class="badge rounded-pill bg-primary fs-6" style="cursor: pointer" @click="sortPiramid('all')">All</span></div>
              <div class="col mb-3"><span class="badge rounded-pill bg-warning fs-6" style="cursor: pointer" @click="sortPiramid('base')">Base</span></div>
              <div class="col mb-3"><span class="badge rounded-pill bg-success fs-6" style="cursor: pointer" @click="sortPiramid('heart')">Heart</span></div>
              <div class="col mb-3"><span class="badge rounded-pill bg-dark fs-6" style="cursor: pointer" @click="sortPiramid('top')">Top</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-10">
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col" v-for="ingredient in filteredList" :key="ingredient.id">
          <div class="card h-100 crd-vh">
            <div class="card-body">
              <h5 class="card-title d-flex justify-content-between align-items-center">
                <router-link :to="'/ingredients/actions/' + ingredient.id" class="text-dark"
                  ><span class="text-decoration-underline">{{ ingredient.name }}</span></router-link
                >
                <span title="Ifra Limits" class="text-black-50" v-if="ingredient.ifra">{{ ingredient.ifra }}</span>
                <span title="Ifra Limits" class="text-black-50" v-if="!ingredient.ifra">No Limit</span>
                <span title="Cas number" class="text-black-50">{{ ingredient.casNumber }}</span>
              </h5>
              <div class="card-text">
                <div class="row">
                  <div class="col-12 col-md-6 text-justify">
                    <h4>Odor Description</h4>
                    <span>{{ ingredient.odorDescription }}</span>
                  </div>

                  <div class="col-12 col-md-6 mt-3">
                    <h4>Dilutions</h4>
                    <div class="row g-1 row-cols-4 row-cols-md-4">
                      <div class="col" v-for="dilution in ingredient.dilutions" :key="dilution.id">
                        <span class="badge rounded-pill bg-dark px-4">{{ dilution.quantity }}</span>
                      </div>
                    </div>

                    <h4 class="mt-3">Olfactive Families</h4>
                    <div class="row g-1 row-cols-4 row-cols-md-4">
                      <div class="col" v-for="olfactiveFamiliy in ingredient.olfactiveFamilies" :key="olfactiveFamiliy.id">
                        <span class="badge rounded-pill bg-success">{{ olfactiveFamiliy.name }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 d-flex justify-content-between align-items-center mt-3">
                    <h5 class="text-center">
                      Odor Inpact <br />
                      <span class="badge rounded-pill bg-dark px-4">{{ ingredient.odorImpact }}</span>
                    </h5>
                    <h5 class="text-center">
                      Odor Life <br />
                      <span class="badge rounded-pill bg-dark px-4">{{ ingredient.odorLife }}</span>
                    </h5>
                    <h5 class="text-center">
                      Piramid Level <br />
                      <span class="badge rounded-pill bg-dark px-4">{{ ingredient.pyramidLevel }}</span>
                    </h5>
                    <h5 class="text-center">
                      Type <br />
                      <span class="badge rounded-pill bg-dark px-4">{{ ingredient.type }}</span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import customAxios from "../../axios";
import Eror from "../Eror.vue";

export default {
  components: { Eror },
  data() {
    return {
      ingredients: [],
      bkpIngredients: [],
      stats: [],
      searchField: "",
    };
  },
  created() {
    this.getIngredients();
    this.getStats();
  },
  computed: {
    filteredList() {
      return this.ingredients.filter((ing) => {
        return ing.name.toLowerCase().includes(this.searchField.toLowerCase());
      });
    },
  },
  methods: {
    async getIngredients() {
      await customAxios({
        method: "get",
        url: "api/v1/ingredients",
      })
        .then((res) => {
          console.log(res);
          this.ingredients = res.data;
          this.bkpIngredients = res.data;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },

    async getStats() {
      await customAxios({
        method: "get",
        url: "api/v1/dilutions/count-quantity",
      })
        .then((res) => {
          this.stats = res.data;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    async downloadIngredients() {
      // TODO
    },
    sortPiramid(piramid) {
      if (piramid == "all") {
        this.ingredients = this.bkpIngredients;
      } else {
        this.ingredients = this.bkpIngredients.filter((ing) => ing.pyramidLevel == piramid);
      }
    },
  },
};
</script>

<style scoped>
.crd-vh:hover {
  transition: 0.5s;
  box-shadow: 10px 10px #ff0;
}
</style>
