<template>
    <div class="col-12 col-md-12 mt-5">
        <div class="row">
            <div class="col-12 col-md-8">


                <div class="form-floating mb-3">
                    <VueMultiselect v-model="form.ingredientSelected" :options="form.ingredients"
                        :close-on-select="true" :clear-on-select="true" maxHeight="200"
                        @select="ingredientChange($event)" placeholder="Select Ingredient" label="name"
                        track-by="name" />
                </div>



            </div>

            <div class="col-12 col-md-4 d-flex justify-content-center align-items-center">
                <button class="btn btn-lg btn-dark w-100" @click.prevent="addIngredient()">
                    <div class="">
                        <span>Add</span>

                        <v-icon name="ri-add-circle-fill" scale="1.3" fill="grey" animation="flash" hover
                            style="margin-left: 10px; cursor: pointer" title="Add Ingredient" />
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import VueMultiselect from "vue-multiselect";
import customAxios from "../axios";

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

    // const alchool = {
    //   name: "Alchool",
    //   casNumber: "91-64-5",
    //   pyramidLevel: "alch",
    //   odorDescription: "Acxhool for perfume",
    //   type: "syntetic",
    //   odorImpact: 0,
    //   odorLife: 0,
    //   dilutions: [
    //     {
    //       quantity: 100,
    //     },
    //   ],
    //   olfactiveFamilies: [],
    // };

    // form.ingredients.push(alchool);
};

const addIngredient = () => {
    // console.log(form.amount);
    // console.log(form.ppt);
    // console.log(form.total_ppts);
    // console.log(form.ppt_per)
    // console.log([form?.amount, form?.ppt, form?.total_ppts, form?.ppt_per]);
 
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