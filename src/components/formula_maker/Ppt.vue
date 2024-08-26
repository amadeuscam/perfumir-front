<template>
  <div class="col-12 col-md-12">
    <div class="row">
      <div class="col-12 col-md-8">
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="form-floating mb-3">
              <VueMultiselect
                v-model="form.ingredientSelected"
                :options="form.ingredients"
                :close-on-select="true"
                :clear-on-select="true"
                maxHeight="200"
                @select="ingredientChange($event)"
                placeholder="Select Ingredient"
                label="name"
                track-by="name"
              />
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="form-floating mb-3">
              <select class="form-select" id="dilutions" v-model="form.dilutionSelected" aria-label="Floating label select example">
                <option :value="dilution.quantity" v-for="dilution in form.dilutions" :key="dilution.id">
                  {{ dilution.quantity }}
                </option>
              </select>
              <label for="name">Dilution</label>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="form-floating mb-3">
              <select class="form-select" id="dilutions" v-model="form.ppt_per" :class="{ 'border border-warning': form.ppt_per == null }" aria-label="Floating label select example">
                <option value="mil">Thousand</option>
                <option value="weight">Weight</option>
              </select>
              <label for="name">Parts by </label>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="name" placeholder="0.100" required v-model="form.ppt" :class="{ 'border border-warning': form.ppt == null }" />
              <label for="name">Ppt</label>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="name" placeholder="0.100" required v-model="form.total_ppts" :class="{ 'border border-warning': form.total_ppts == null }" />
              <label for="name">Total Parts by Weight</label>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="name" placeholder="0.100" required v-model="form.amount" :class="{ 'border border-warning': form.amount == null }" />
              <label for="name">Amount to make</label>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4 d-flex justify-content-center align-items-center">
        <button class="btn btn-lg btn-dark w-100" @click.prevent="addIngredient()">
          <div class="">
            <span>Add</span>

            <v-icon name="ri-add-circle-fill" scale="1.3" fill="grey" animation="flash" hover style="margin-left: 10px; cursor: pointer" title="Add Ingredient" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, onMounted, reactive } from "vue";
import VueMultiselect from "vue-multiselect";
import customAxios from "../../axios";

onMounted(() => {
  getIngredients();
});

const emit = defineEmits(["ingredientSelectedHAndler"]);

const form = reactive({
  ingredients: [],
  ingredientsBackup: [],
  dilutions: [],
  ingredientSelected: null,
  dilutionSelected: null,
  ppt: null,
  amount: null,
  quantity: null,
  total_ppts: null,
  ppt_per: null,
});

const ingredientChange = (event) => {
  form.dilutions = form.ingredientSelected.dilutions;
  form.dilutionSelected = Math.min(...form.dilutions.map((dil) => dil.quantity));
};

const getIngredients = async () => {
  form.ingredients = [];

  await customAxios({
    method: "get",
    url: "api/v1/ingredients",
  })
    .then((res) => {
      form.ingredients = res.data;
      form.ingredientsBackup = res.data;
    })
    .catch((error) => {
      console.error(error.response.data.message);
    });

  const alchool = {
    name: "Alchool",
    casNumber: "91-64-5",
    pyramidLevel: "alch",
    odorDescription: "Acxhool for perfume",
    type: "syntetic",
    odorImpact: 0,
    odorLife: 0,
    dilutions: [
      {
        quantity: 100,
      },
    ],
    olfactiveFamilies: [],
  };

  form.ingredients.push(alchool);
};

const addIngredient = () => {
  // console.log(form.amount);
  // console.log(form.ppt);
  // console.log(form.total_ppts);
  // console.log(form.ppt_per)
  // console.log([form?.amount, form?.ppt, form?.total_ppts, form?.ppt_per]);

  if ([form?.amount, form?.ppt, form?.total_ppts, form?.ppt_per].includes(null)) {
    return;
  }

  form.ingredients = form.ingredients.filter((x) => x.id != form.ingredientSelected.id);

  if (form.ppt_per == "weight") {
    const cantidadGr = (form.ppt / form.total_ppts) * Number(this.amount);
    form.quantity = Math.round(cantidadGr * 1000) / 1000;
    const data = [form.ingredientSelected, form.quantity, form.dilutionSelected];
    emit("ingredientSelectedHAndler", data);
  } else {
    const p_per_mill = (form.ppt / form.total_ppts) * 1000;
    const cantidadGr = (p_per_mill / 1000) * (Number(form.amount) * 1000);
    form.quantity = Math.round(cantidadGr * 1000) / 1000;
    const data = [form.ingredientSelected, form.quantity / 1000, form.dilutionSelected];
    emit("ingredientSelectedHAndler", data);
  }

  // form.amount = null;
  form.ingredientSelected = null;
  form.quantity = null;
  form.dilutionSelected = null;
  form.dilutions = null;
  form.ppt = null;
  // form.total_ppts = null;
  // form.ppt_per = null;
};
</script>

<style scoped>
:deep(.multiselect__input, .multiselect__single) {
  min-height: 38px !important;
  position: relative !important;
  line-height: 40px;
  vertical-align: middle;
}

:deep(.multiselect__single) {
  min-height: 38px !important;
  line-height: 40px;
  /* position: relative !important;
 
  vertical-align: middle; */
}
</style>
