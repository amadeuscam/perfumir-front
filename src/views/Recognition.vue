<template>
    <div class="col-12 col-md-12 mt-5" style="min-height: 50vh;">
        <div class="row">
            <div class="col-12 col-md-6" style="position: relative;">
                <h2>Ingredients <span class="text-danger">Not</span> Guessed ({{ ingredientsToGuess.length }})</h2>
                <div class="row">
                    <div class="col-12 col-md-8">
                        <div class="form-floating mb-3">
                            <VueMultiselect v-model="form.ingredientSelected" :options="form.ingredients"
                                :close-on-select="true" :clear-on-select="true" maxHeight="200"
                                @select="ingredientChange($event)" placeholder="Select Ingredient" label="name"
                                track-by="name" />
                        </div>
                    </div>

                    <div class="col-12 col-md-4 ">
                        <button class="btn btn-lg btn-dark w-100" @click.prevent="addIngredient()">
                            <div class="">
                                <span>Add</span>

                                <v-icon name="ri-add-circle-fill" scale="1.3" fill="grey" animation="flash" hover
                                    style="margin-left: 10px; cursor: pointer" title="Add Ingredient" />
                            </div>
                        </button>
                    </div>
                </div>

                <draggable v-model="ingredientsToGuess" :animation="300" tag="ul" class="list-group" group="meals"
                    item-key="1">
                    <template #item="{ element: meal }">
                        <li class="list-group-item list-group-item-dark">{{ meal }}</li>
                    </template>
                </draggable>
            </div>
            <div class="col-12 col-md-6" style="overflow: visible">
                <ConfettiExplosion :particleCount="200" :force="0.5" v-if="visible" />
                <div class="row">
                    <div class="col-12 col-md-6">
                        <h2>Ingredients Guessed ({{ ingredientsGuessed.length }})</h2>
                    </div>
                    <div class="col-12 col-md-6 text-end">
                        <button class="btn  btn-dark w-100" @click.prevent="saveReg()">
                            <div class="">
                                <span>Save</span>
                            </div>
                        </button>
                    </div>
                </div>

                <draggable v-model="ingredientsGuessed" tag="ul" :animation="300" class="list-group" group="meals"
                    @change="checkMove('guess')" item-key="2">
                    <template #item="{ element: meal }">
                        <li class="list-group-item list-group-item-success">
                            {{ meal }}
                        </li>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
    <div class="col-12">
        <h4>History</h4>
        <div class="row">

        </div>
    </div>
</template>

<script setup>
import draggable from "vuedraggable";
import { onMounted, reactive, ref, nextTick } from "vue";
import VueMultiselect from "vue-multiselect";
import customAxios from "../axios";
import ConfettiExplosion from "vue-confetti-explosion";

onMounted(() => {
    getIngredients();
});

const emit = defineEmits(["ingredientSelectedHAndler"]);

const ingredientsToGuess = ref([]);

const ingredientsGuessed = ref([]);
const css_select_pr = ref("realtive");
const visible = ref(false);

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

const checkMove = async (e) => {

    visible.value = false;
    await nextTick();
    visible.value = true;
}

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


};

const addIngredient = () => {
    console.log(form.ingredientSelected)

    ingredientsToGuess.value.push(form.ingredientSelected['name'])
    if (ingredientsToGuess.value.length > 2) {
        css_select_pr.value = "absolute"
    }
};

const saveReg = () => {
    let saveList = []
    for (let item of ingredientsToGuess.value) {
        saveList.push({
            recognized: false,
            ingredientName: item
        })
    }

    for (let item of ingredientsGuessed.value) {
        saveList.push({
            recognized: true,
            ingredientName: item
        })
    }
    console.log(ingredientsToGuess.value)
    console.log(ingredientsGuessed.value)
    console.log(saveList)
    customAxios.post("/api/v1/recognitions", saveList)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
}
</script>

<style scoped>
li:hover {
    cursor: pointer;
}

:deep(.multiselect__content-wrapper) {
    max-height: 140px !important;
    z-index: 99;
    position: v-bind(css_select_pr);
    display: block;
}
</style>