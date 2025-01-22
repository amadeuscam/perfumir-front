<template>
  <div class="container-fluid mt-5">
    <button class="btn btn-md btn-dark mb-3"    @click.prevent="$router.go(-1)"><v-icon name="ri-arrow-go-back-line" /> Go
      Back</button>

    <div class="row">
      <form class="col-12 col-md-8">
        <h2>
          Add Formula <span style="color: #848484"> {{ formula.name }}</span>
        </h2>
        <div class="form-floating mb-3">
          <select class="form-select" id="dilutions" v-model="management.typeFormula"
            aria-label="Floating label select example">
            <option value="weight">Weight</option>
            <option value="ppt">PPT</option>
            <option value="procentage">Procentage</option>
          </select>
          <label for="name">Construct formula with:</label>
        </div>

        <div class="row">
          <div class="col-12 col-md-12" v-if="formula.status == 'done'">
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="name" placeholder="0.100" required
                    v-model="management.amountToMake" @change.prevent="changeAmountToMake()" />
                  <label for="name">Amount To Make</label>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="name" placeholder="0.100" required
                    v-model="management.desiredProcentage" @change.prevent="changeDesiredProcentage()" />
                  <label for="name">Desired Procentage</label>
                </div>
              </div>
            </div>
          </div>

          <!-- the way we can add te ingredients  -->

          <div class="col-12 col-md-12" v-if="formula.status !== 'done'">
            <Weight @ingredientSelectedHAndler="handleSelectIngredient" v-if="management.typeFormula == 'weight'" />
            <Ppt @ingredientSelectedHAndler="handleSelectIngredient" v-if="management.typeFormula == 'ppt'" />
            <Procentage @ingredientSelectedHAndler="handleSelectIngredient"
              v-if="management.typeFormula == 'procentage'" />
          </div>

          <Table :ingredient="management.piramidIngredient" @updateFormulaParent="formulaUpdate"
            :save-formula="management.formulaSave" :formula="formula" :estado="management.stateProps"
            :formula-production="formulaDone" />
        </div>
      </form>
      <div class="col-12 col-md-4">
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="form-floating mb-3">
              <select class="form-select" id="status" v-model="formula.status" @change="statusChange($event)"
                aria-label="Floating label select example">
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <label for="status">Status of Formula</label>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="name" placeholder="coumarin" required
                v-model="management.version"
                :class="{ 'border border-warning': management.version && management.version.length == 0 }" />
              <label for="name">Version</label>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="form-floating mb-3">
              <!-- @change.prevent="updatePPT()" -->
              <input type="text" class="form-control" id="name" placeholder="coumarin" required v-model="formula.ppt" />
              <label for="name">PPT * </label>
            </div>
          </div>

          <div class="col-12 col-md-12 text-center" v-if="formula.status !== 'done'">
            <button class="btn btn-lg w-100 btn-success mb-3" @click.prevent="saveFormula()"
              :disabled="management.version && management.version.length == 0">
              <div class="d-flex justify-content-center align-items-center">
                <v-icon name="ri-send-plane-2-line" scale="1.4" style="margin-right: 10px" />
                <span> Submit Formula</span>
              </div>
            </button>
          </div>

          <div class="col-12 col-md-12" v-if="formula.status !== 'done'">
            <div class="row">
              <div class="col-6 col-md-6">
                <h6>
                  Total (gr): <br />
                  <span style="font-size: 2rem">{{ formula.total.toFixed(3) }}</span>
                </h6>
              </div>
              <div class="col-6 col-md-6">
                <h6>
                  Concentrate: <br />
                  <span style="font-size: 2rem">{{ formula.concentrate.toFixed(3) }}</span>
                </h6>
              </div>
              <div class="col-6 col-md-6">
                <h6>
                  Final Concentrate: <br />
                  <span style="font-size: 2rem">
                    {{ formula.final_concentrate_perfume ? formula.final_concentrate_perfume.toFixed(2) : 0 }}
                    %</span>
                </h6>
              </div>
              <div class="col-6 col-md-6">
                <h6>
                  Total Ingredients: <br />
                  <span style="font-size: 2rem">
                    {{ formula.totalIngredients }}
                  </span>
                </h6>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-12" v-if="formula.status == 'done'">
            <div class="row">
              <div class="col-6 col-md-6">
                <h6>
                  Total Amount Of Alcool to Add: <br />
                  <span style="font-size: 2rem">{{ formulaDone.alchoolAdd.toFixed(3) }}</span>
                </h6>
              </div>
              <div class="col-6 col-md-6">
                <h6>
                  Total: <br />
                  <span style="font-size: 2rem">{{ formulaDone.totalAmount.toFixed(3) }} gr</span>
                </h6>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-12">
            <div class="form-floating mb-3">
              <textarea class="form-control" id="comments" rows="50" cols="8" required v-model="management.comments"
                style="min-height: 200px" />
              <label for="comments">Comments</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import customAxios from "../../axios";
import Table from "../formula_body/Table.vue";
import Ppt from "../formula_maker/Ppt.vue";
import Procentage from "../formula_maker/Procentage.vue";
import Weight from "../formula_maker/Weight.vue";

const formulaDone = reactive({
  desiredProcentage: 20,
  amountToMake: 10,
  currentAmountOfConcentrate: 0,
  desiredAmountConcentrate: 0,
  desiredAmountAlchool: 0,
  scaleFactor: 0,
  totalAmount: 0,
  alchoolAdd: 0,
});

const formula = reactive({
  total: 0,
  concentrate: 0,
  ppt: 1000,
  version: null,
  status: "in_progress",
  totalIngredients: 0,
  final_concentrate_perfume: 0,
  comments: "",
});

const management = reactive({
  id: null,
  ingredients: [],
  typeFormula: "weight",
  ingredientsBackup: [],
  piramidIngredient: [],
  amountToMake: 10,
  desiredProcentage: 20,
  stateProps: false,
  version: "",
  comments: "",
  formulaSave: {
    status: false,
    id: null,
    comments: "",
    version: "",
  },
});

onMounted(() => {
  const route = useRoute();
  management.id = route.params.id;
  management.typeFormula = "weight";
  console.log(formula);
  // console.log(route.params);
  // console.log(route.params.fmanagementId);
  // console.log(route.params.formulaId);
  if (!management.id && route.params.fmanagementId.length > 0) {
    management.id = route.params.fmanagementId;
  }
  // console.log(management.id);
  if (route.params.fmanagementId && route.params.formulaId) {
    copyFormula(route.params.fmanagementId, route.params.formulaId);
  }
});

const formulaUpdate = (payload) => {
  console.log(payload);
  if (payload.desiredProcentage) {
    management.desiredProcentage = payload.desiredProcentage;
    formulaDone.desiredProcentage = payload.desiredProcentage;
    management.amountToMake = payload.amountToMake;
    formulaDone.amountToMake = payload.amountToMake;

    formulaDone.currentAmountOfConcentrate = payload.currentAmountOfConcentrate;
    formulaDone.desiredAmountConcentrate = payload.desiredAmountConcentrate;
    formulaDone.desiredAmountAlchool = payload.desiredAmountAlchool;
    formulaDone.scaleFactor = payload.scaleFactor;
    formulaDone.totalAmount = payload.totalAmount;
    formulaDone.alchoolAdd = payload.alchoolAdd;

    console.log(formulaDone);
    // emit("updateFormula", formulaProduction);
  } else {
    formula.total = payload.total;
    formula.concentrate = payload.concentrate;
    formula.ppt = payload.ppt;
    formula.version = payload.version;
    formula.status = payload.status;
    formula.totalIngredients = payload.totalIngredients;
    formula.final_concentrate_perfume = (((100 / formula.total) * formula.concentrate) / 100) * 100;
    // emit("updateFormula", formula);
    console.log(formula);
  }
};

const handleSelectIngredient = (value) => {
  management.piramidIngredient = [];
  const [ingredient, quantity, dilution] = value;

  const ingredientFormula = {
    ingredientName: ingredient.name,
    pyramidLevel: ingredient.pyramidLevel,
    amount: Number(quantity),
    dilutionOfIngredient: dilution,
    ifra: ingredient.ifra,
    alcohol: 100 - dilution,
    ppt: 0,
    material_raw: 0,
    materialDoneRaw: 0,
    rel: 0,
    abs: 0,
  };

  // this.addIngredient();
  management.stateProps = !management.stateProps;

  management.piramidIngredient.push(ingredientFormula);
  // console.log(this.piramidIngredient);

  // this.tableIngredient.value.addIngredient(payload);
};

const fillIngredients = (payload) => {
  console.log(payload);
  management.piramidIngredient = [];
  payload.formulaIngredients.forEach((elem) => {
    // this.ingredients = this.ingredients.filter((x) => x.name != elem.ingredientName);

    console.log(elem);
    const ingredient = {
      ingredientName: elem.ingredientName,
      pyramidLevel: elem.pyramidLevel,
      amount: Number(elem.amount),
      dilutionOfIngredient: elem.dilutionOfIngredient,
      alcohol: elem.alcohol,
      ifra: elem.ifra,
      ppt: 0,
      material_raw: 0,
      materialDoneRaw: 0,
      rel: 0,
      abs: 0,
    };

    management.piramidIngredient.push(ingredient);
  });
  management.stateProps = !management.stateProps;
};

const copyFormula = async (fmanagementId, formulaId) => {
  await getIngredients();
  management.typeFormula = "weight";
  customAxios({
    method: "get",
    url: `api/v1/formulas/${fmanagementId}/${formulaId}`,
  })
    .then((res) => {
      console.log(res.data);
      formula.status = res.data.status;
      formula.version = res.data.version;
      management.comments = res.data.comment;
      management.version = res.data.version;
      fillIngredients(res.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

const getIngredients = async () => {
  management.ingredients = [];

  await customAxios({
    method: "get",
    url: "api/v1/ingredients",
  })
    .then((res) => {
      management.ingredients = res.data;
      management.ingredientsBackup = res.data;
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

  management.ingredients.push(alchool);
};

const saveFormula = () => {
  console.log(formula.comments);
  console.log(management.id);
  console.log(management.version.length > 0);

  management.formulaSave.status = true;
  management.formulaSave.id = management.id;
  management.formulaSave.comments = management.comments;
  management.formulaSave.version = management.version;
};

const changeAmountToMake = () => {
  formulaDone.amountToMake = Number(management.amountToMake);
};
const changeDesiredProcentage = () => {
  formulaDone.desiredProcentage = Number(management.desiredProcentage);
};
</script>
