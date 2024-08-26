<template>
  <div class="col-12 col-md-12">
    <div class="row">
      <div class="col-12 col-md-3">
        <div class="form-floating mb-3">
          <VueMultiselect
            v-model="storage.ingredientSelected"
            :options="storage.ingredients"
            :close-on-select="true"
            :clear-on-select="true"
            :maxHeight="200"
            @select="ingredientChange($event)"
            placeholder="Select Ingredient"
            label="name"
            track-by="name"
          />
        </div>
      </div>

      <div class="col-12 col-md-3">
        <div class="form-floating mb-3">
          <select class="form-select" id="dilutions" v-model="storage.dilutionSelected" aria-label="Floating label select example">
            <option :value="dilution.quantity" v-for="dilution in storage.dilutions" :key="dilution.id">
              {{ dilution.quantity }}
            </option>
          </select>
          <label for="name">Dilution</label>
        </div>
      </div>

      <div class="col-12 col-md-3">
         
        <div class="form-floating mb-3">
          
          <input type="text" class="form-control" id="name" placeholder="0.100" :class="{ 'border border-warning': storage.quantity == null  }" required v-model="storage.quantity" />
          <label for="name">Quantity</label>
        </div>
      </div>

      <div class="col-12 col-md-3">
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
import { onMounted, reactive } from "vue";
import VueMultiselect from "vue-multiselect";
import customAxios from "../../axios";

const emit = defineEmits(["ingredientSelectedHAndler"]);

onMounted(() => {
  getIngredients();
   
});

const storage = reactive({
  ingredients: [],
  ingredientsBackup: [],
  dilutions: [],
  ingredientSelected: null,
  dilutionSelected: null,
  quantity: null,
  inpErr: false,
});

const ingredientChange = (event) => {
  storage.dilutions = storage.ingredientSelected.dilutions;
  storage.dilutionSelected = Math.min(...storage.dilutions.map((dil) => dil.quantity));
};

const getIngredients = async () => {
  storage.ingredients = [];

  await customAxios({
    method: "get",
    url: "api/v1/ingredients",
  })
    .then((res) => {
      storage.ingredients = res.data;
      storage.ingredientsBackup = res.data;
    })
    .catch((error) => {
      storage.error = error.response.data.message;
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

  storage.ingredients.push(alchool);
};

const addIngredient = () => {
  console.log(storage.quantity);
  if (storage.quantity == null) {
    storage.inpErr = !storage.inpErr;
    return;
  }

  storage.ingredients = storage.ingredients.filter((x) => x.id != storage.ingredientSelected.id);
  const data = [storage.ingredientSelected, storage.quantity, storage.dilutionSelected];
  emit("ingredientSelectedHAndler", data);
  storage.ingredientSelected = null;
  storage.quantity = null;
  storage.dilutionSelected = null;
  storage.dilutions = null;
};
</script>

<style scoped>
:deep(.multiselect__input, .multiselect__single) {
  min-height: 40px !important;
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
