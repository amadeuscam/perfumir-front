<template>
  <div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Dilution</th>
          <th scope="col">Weight (g)</th>
          <th scope="col">%Abs</th>
          <th scope="col">%Rel</th>
          <th scope="col">Ppt</th>
        </tr>
      </thead>
      <tbody>
        <WrapperNotes
          :ingredient="formula.ingredients.baseNotes"
          title="Base Notes"
          :status="formula.status"
          :formulaProduction="formulaProductionReactive"
          :formula="formula"
          @updateFormulaProduction="updateProdFormula"
          @updateFormula="formulaUpdate"
          @updateIngredient="ingredientUpdate"
          @removeIngredient="removeIngredient"
        />
        <WrapperNotes
          :ingredient="formula.ingredients.heartNotes"
          title="Heart Notes"
          :status="formula.status"
          :formula="formula"
          @updateFormula="formulaUpdate"
          @updateFormulaProduction="updateProdFormula"
          :formulaProduction="formulaProductionReactive"
          @updateIngredient="ingredientUpdate"
          @removeIngredient="removeIngredient"
        />
        <WrapperNotes
          :ingredient="formula.ingredients.topNotes"
          :formulaProduction="formulaProductionReactive"
          title="Top Notes"
          :status="formula.status"
          :formula="formula"
          @updateFormulaProduction="updateProdFormula"
          @updateFormula="formulaUpdate"
          @updateIngredient="ingredientUpdate"
          @removeIngredient="removeIngredient"
        />
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { defineProps, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import customAxios from "../../axios";
import WrapperNotes from "../formula_body/WrapperNotes.vue";

const toast = useToast();
const router = useRouter();

const props = defineProps({
  ingredient: Array,
  formula: Object,
  formulaProduction: Object,
  estado: Boolean,
  saveFormula: Boolean,
});

const emit = defineEmits(["updateFormulaParent"]);

watch(
  () => props.ingredient,
  (first, second) => {
    console.log("Watch props.selected function called with args:", first, second);
    // addIngredientIndividual(first);
    first.forEach((element) => {
      addIngredientIndividual(element);
    });
  }
);

watch(
  () => props,
  (first, second) => {
    console.log("Watch props.selected function called with args:", first, second);
    console.log(first);
    console.log(props.formula);
    console.log(first.formula);
    console.log(first.formulaProduction);
    if (first.saveFormula.status) {
      console.log(first.saveFormula);

      submitData(first.saveFormula);
    }
    if (first.formula.status !== "done") {
      formulaUpdate(first.formula);
      resetFormulaProd();
    } else {
      formulaUpdate(first.formulaProduction);
      console.log("exec");
      if (formulaProductionReactive.touch) {
        statusChange(false);
      } else {
        statusChange(true);
      }
    }
  },
  { deep: true }
);

const formula = reactive({
  total: 0,
  concentrate: 0,
  ppt: 1000,
  version: null,
  status: "in_progress",
  totalIngredients: 0,
  final_concentrate_perfume: 0,
  ingredients: {
    baseNotes: [],
    heartNotes: [],
    topNotes: [],
    alcohol: [],
  },
});

const formulaProductionReactive = reactive({
  desiredProcentage: 20,
  amountToMake: 10,
  currentAmountOfConcentrate: 0,
  desiredAmountConcentrate: 0,
  desiredAmountAlchool: 0,
  scaleFactor: 0,
  totalAmount: 0,
  alchoolAdd: 0,
  touch: false,
});

const counter = reactive({
  count: 0,
});

const resetFormulaProd = () => {
  console.log("me llaman");

  formulaProductionReactive.desiredProcentage = 20;
  formulaProductionReactive.amountToMake = 10;
  formulaProductionReactive.currentAmountOfConcentrate = 0;
  formulaProductionReactive.desiredAmountConcentrate = 0;
  formulaProductionReactive.desiredAmountAlchool = 0;
  formulaProductionReactive.scaleFactor = 0;
  formulaProductionReactive.totalAmount = 0;
  formulaProductionReactive.alchoolAdd = 0;
  emit("updateFormulaParent", formulaProductionReactive);
};

const formulaUpdate = (payload) => {
  console.log(payload);

  if (payload.desiredProcentage) {
    formulaProductionReactive.desiredProcentage = payload.desiredProcentage;
    formulaProductionReactive.amountToMake = payload.amountToMake;
    formulaProductionReactive.currentAmountOfConcentrate = payload.currentAmountOfConcentrate;
    formulaProductionReactive.desiredAmountConcentrate = payload.desiredAmountConcentrate;
    formulaProductionReactive.desiredAmountAlchool = payload.desiredAmountAlchool;
    formulaProductionReactive.scaleFactor = payload.scaleFactor;
    formulaProductionReactive.totalAmount = payload.totalAmount;
    formulaProductionReactive.alchoolAdd = payload.alchoolAdd;
    formula.status = "done";
    // updateProdFormula(formulaProductionReactive);
    console.log(formulaProductionReactive);

    emit("updateFormulaParent", formulaProductionReactive);
  } else {
    formula.total = payload.total;
    formula.concentrate = payload.concentrate;
    formula.ppt = payload.ppt;
    formula.version = payload.version;
    formula.status = payload.status;
    formula.totalIngredients = payload.totalIngredients;
    formula.final_concentrate_perfume = (((100 / formula.total) * formula.concentrate) / 100) * 100;

    emit("updateFormulaParent", formula);
    console.log(formula);
  }
};

const updateProdFormula = (payload) => {
  counter.count += 1;
  console.log(payload);
  // console.log(payload.data);
  // console.log(counter.count % 3 == 0);

  // payload.data.forEach(element => {
  //   console.log(element)
  // });

  const currentAmountOfConcentrateAmount = payload.data.reduce((n, { materialDoneRaw }) => n + materialDoneRaw, 0);
  const totalAmount = payload.data.reduce((n, { amountToUse }) => (amountToUse ? n + amountToUse : 0), 0);

  console.log(currentAmountOfConcentrateAmount);
  console.log(totalAmount);

  formulaProductionReactive.currentAmountOfConcentrate = currentAmountOfConcentrateAmount;
  formulaProductionReactive.totalAmount = totalAmount;

  formulaProductionReactive.desiredAmountConcentrate = (formulaProductionReactive.amountToMake * formulaProductionReactive.desiredProcentage) / 100;
  formulaProductionReactive.desiredAmountAlchool = formulaProductionReactive.amountToMake - formulaProductionReactive.desiredAmountConcentrate;
  formulaProductionReactive.scaleFactor = formulaProductionReactive.desiredAmountConcentrate / formulaProductionReactive.currentAmountOfConcentrate;

  formulaProductionReactive.alchoolAdd = formulaProductionReactive.amountToMake - formulaProductionReactive.totalAmount;

  console.log(formulaProductionReactive);
  // emit("updateFormulaParent", formulaProductionReactive);
};

const removeIngredient = (payload) => {
  const currentIngredient = payload.ingredient;

  const mapeo = {
    base: formula.ingredients.baseNotes,
    heart: formula.ingredients.heartNotes,
    top: formula.ingredients.topNotes,
  };

  let objIndex = mapeo[currentIngredient.pyramidLevel].findIndex((obj) => obj.ingredientName == currentIngredient.ingredientName);
  mapeo[currentIngredient.pyramidLevel].splice(objIndex, 1);

  formula.total -= currentIngredient.amount;
  formula.concentrate -= currentIngredient.material_raw;
  formula.totalIngredients -= 1;
  formulaUpdate(formula);
};

const getCurrentArray = (ingredient) => {
  const mapeo = {
    base: formula.ingredients.baseNotes,
    heart: formula.ingredients.heartNotes,
    top: formula.ingredients.topNotes,
  };
  console.log(ingredient);
  console.log(ingredient.pyramidLevel);

  console.log(mapeo[ingredient.pyramidLevel]);

  return mapeo[ingredient.pyramidLevel];
};

const ingredientUpdate = (payload) => {
  console.log(payload);

  const currentArray = getCurrentArray(payload.ingredient);
  const currentIngredient = payload.ingredient;

  if (formula.status == "done" && payload.scope == "dilutionOfIngredient") {
    switch (currentIngredient.pyramidLevel) {
      case "base":
        let ingBase = formula.ingredients.baseNotes.findIndex((obj) => obj.ingredientName == currentIngredient.ingredientName);
        const mtrb = (currentIngredient.amount * currentIngredient.dilutionOfIngredient) / 100;
        formula.ingredients.baseNotes[ingBase]["materialDoneRaw"] = mtrb;
        formula.ingredients.baseNotes[ingBase]["prodDilutionOfIngredient"] = Number(payload.value);

        break;
      case "heart":
        let ingHeart = formula.ingredients.heartNotes.findIndex((obj) => obj.ingredientName == currentIngredient.ingredientName);
        const mtrh = (currentIngredient.amount * currentIngredient.dilutionOfIngredient) / 100;
        formula.ingredients.heartNotes[ingHeart]["materialDoneRaw"] = mtrh;
        formula.ingredients.heartNotes[ingHeart]["prodDilutionOfIngredient"] = Number(payload.value);

        break;
      case "top":
        let ingTop = formula.ingredients.topNotes.findIndex((obj) => obj.ingredientName == currentIngredient.ingredientName);
        const mtrt = (currentIngredient.amount * currentIngredient.dilutionOfIngredient) / 100;
        formula.ingredients.topNotes[ingTop]["materialDoneRaw"] = mtrt;
        formula.ingredients.topNotes[ingTop]["prodDilutionOfIngredient"] = Number(payload.value);

        break;

      default:
        break;
    }

    statusChange(false);
  } else {
    updateUtil(payload.value, currentIngredient, payload.scope, currentArray);
  }
};

const updateUtil = (value, ingredient, scope, arrNotes) => {
  console.log(value, ingredient, scope, arrNotes);
  let objIndex = arrNotes.findIndex((obj) => obj.ingredientName == ingredient.ingredientName);
  console.log(objIndex);

  if (scope == "amount") {
    const res = Number(ingredient.amount) - Number(value);

    if (parseFloat(res) < parseFloat(0)) {
      formula.total += Math.abs(res);
      // amount += Math.abs(res);
    } else {
      formula.total -= res;
      // piramid.amount -= res;
    }
    // //el valor antiguo
    const material_raw = ingredient.amount - (ingredient.amount * ingredient.alcohol) / 100;
    // el valor nuevo
    const material_raw2 = Number(value) - (Number(value) * ingredient.alcohol) / 100;

    if (ingredient.pyramidLevel !== "alch") {
      // console.log(Math.abs(material_raw - material_raw2));
      // console.log(material_raw - material_raw2);
      formula.concentrate -= material_raw - material_raw2;
    }

    arrNotes[objIndex][scope] = Number(value);
    const ppts = (formula.ppt / formula.concentrate) * material_raw2;
    arrNotes[objIndex].ppt = ppts;
    arrNotes[objIndex].material_raw = material_raw2;
    formulaUpdate(formula);
    // return arrNotes;
  } else {
    console.log("aqui");

    const alchool = 100 - Number(value);
    console.log(alchool);

    const material_raw = ingredient.amount - (ingredient.amount * ingredient.alcohol) / 100;
    const material_raw2 = Number(ingredient.amount) - (Number(ingredient.amount) * alchool) / 100;
    console.log(material_raw - material_raw2);

    formula.concentrate -= material_raw - material_raw2;

    arrNotes[objIndex][scope] = Number(value);
    const ppts = (formula.ppt / formula.concentrate) * material_raw2;
    arrNotes[objIndex].ppt = ppts;
    arrNotes[objIndex].alcohol = 100 - Number(value);
    arrNotes[objIndex].material_raw = material_raw2;
    console.log(arrNotes);
    formulaUpdate(formula);
    // emit("updateFormula", formula);
    // return arrNotes;
  }
};

const statusChange = (dil) => {
  console.log(dil);
  formulaProductionReactive.touch = !formulaProductionReactive.touch;

  logicStatusChange();
  updateFormulaDone(100, dil);
  calculateAlchoolToUse();
};

const logicStatusChange = () => {
  const mapeo = {
    base: formula.ingredients.baseNotes,
    heart: formula.ingredients.heartNotes,
    top: formula.ingredients.topNotes,
  };

  const baseAmount = mapeo["base"].reduce((n, { materialDoneRaw }) => n + materialDoneRaw, 0);
  const heartAmount = mapeo["heart"].reduce((n, { materialDoneRaw }) => n + materialDoneRaw, 0);
  const topAmount = mapeo["top"].reduce((n, { materialDoneRaw }) => n + materialDoneRaw, 0);

  console.log(baseAmount + heartAmount + topAmount);

  formulaProductionReactive.currentAmountOfConcentrate = baseAmount + heartAmount + topAmount;
  console.log(formulaProductionReactive.currentAmountOfConcentrate);

  formulaProductionReactive.desiredAmountConcentrate = (formulaProductionReactive.amountToMake * formulaProductionReactive.desiredProcentage) / 100;
  formulaProductionReactive.desiredAmountAlchool = formulaProductionReactive.amountToMake - formulaProductionReactive.desiredAmountConcentrate;
  formulaProductionReactive.scaleFactor = formulaProductionReactive.desiredAmountConcentrate / formulaProductionReactive.currentAmountOfConcentrate;
  formulaUpdate(formulaProductionReactive);
};

const updateFormulaDone = (dilution, dil) => {
  formula.ingredients.baseNotes = formula.ingredients.baseNotes.map((note) => (true ? { ...note, new_amount: formulaProductionReactive.scaleFactor * note.materialDoneRaw } : note));
  formula.ingredients.heartNotes = formula.ingredients.heartNotes.map((note) => (true ? { ...note, new_amount: formulaProductionReactive.scaleFactor * note.materialDoneRaw } : note));
  formula.ingredients.topNotes = formula.ingredients.topNotes.map((note) => (true ? { ...note, new_amount: formulaProductionReactive.scaleFactor * note.materialDoneRaw } : note));
  console.log(formula.ingredients.baseNotes);
  console.log(formula.ingredients.heartNotes);
  console.log(formula.ingredients.topNotes);

  if (dil) {
    formula.ingredients.baseNotes = formula.ingredients.baseNotes.map((note) => (true ? { ...note, prodDilutionOfIngredient: dilution } : note));
    formula.ingredients.heartNotes = formula.ingredients.heartNotes.map((note) => (true ? { ...note, prodDilutionOfIngredient: dilution } : note));
    formula.ingredients.topNotes = formula.ingredients.topNotes.map((note) => (true ? { ...note, prodDilutionOfIngredient: dilution } : note));
    console.log(formula.ingredients.baseNotes);
    console.log(formula.ingredients.heartNotes);
    console.log(formula.ingredients.topNotes);
  }

  formula.ingredients.baseNotes = formula.ingredients.baseNotes.map((note) => (true ? { ...note, amountToUse: note.new_amount / (note.prodDilutionOfIngredient / 100) } : note));
  formula.ingredients.heartNotes = formula.ingredients.heartNotes.map((note) => (true ? { ...note, amountToUse: note.new_amount / (note.prodDilutionOfIngredient / 100) } : note));
  formula.ingredients.topNotes = formula.ingredients.topNotes.map((note) => (true ? { ...note, amountToUse: note.new_amount / (note.prodDilutionOfIngredient / 100) } : note));
  console.log(formula.ingredients.baseNotes);
  console.log(formula.ingredients.heartNotes);
  console.log(formula.ingredients.topNotes);
};

const calculateAlchoolToUse = () => {
  console.log(formula.ingredients.baseNotes);
  console.log(formula.ingredients.heartNotes);
  console.log(formula.ingredients.topNotes);

  const baseAmount = formula.ingredients.baseNotes.reduce((n, { amountToUse }) => n + amountToUse, 0);
  const heartAmount = formula.ingredients.heartNotes.reduce((n, { amountToUse }) => n + amountToUse, 0);
  const topAmount = formula.ingredients.topNotes.reduce((n, { amountToUse }) => n + amountToUse, 0);

  const total_amount = baseAmount + heartAmount + topAmount;
  console.log(total_amount);
  formulaProductionReactive.alchoolAdd = formulaProductionReactive.amountToMake - total_amount;
  // console.log(total_amount);
  formulaProductionReactive.totalAmount = total_amount;
  console.log("amount alchol to use" + (formulaProductionReactive.amountToMake - total_amount));
  formulaUpdate(formulaProductionReactive);
};

const addIngredientIndividual = (ingredientFormula) => {
  console.log(ingredientFormula);

  const material_raw = ingredientFormula.amount - (ingredientFormula.amount * ingredientFormula.alcohol) / 100;
  const materialDoneRaw = (ingredientFormula.amount * ingredientFormula.dilutionOfIngredient) / 100;
  // console.log(material_raw);
  // console.log(materialDoneRaw);
  if (ingredientFormula.pyramidLevel !== "alch") {
    formula.concentrate += material_raw;
    formulaProductionReactive.currentAmountOfConcentrate += materialDoneRaw;
    // console.log(this.formulaDone.currentAmountOfConcentrate);
  }

  const ppts = (formula.ppt / formula.concentrate) * material_raw;
  ingredientFormula.ppt = ppts;
  ingredientFormula.material_raw = material_raw;
  ingredientFormula.materialDoneRaw = materialDoneRaw;

  switch (ingredientFormula.pyramidLevel) {
    case "base":
      formula.ingredients.baseNotes.push(ingredientFormula);
      break;
    case "heart":
      formula.ingredients.heartNotes.push(ingredientFormula);
      break;
    case "top":
      formula.ingredients.topNotes.push(ingredientFormula);
      break;
    case "alch":
      formula.ingredients.alcohol.push(ingredientFormula);
      break;
    default:
      break;
  }
  console.log(formula);

  formula.amount += ingredientFormula.amount;

  formula.total += ingredientFormula.amount;
  formula.totalIngredients += 1;
  console.log(formula);
  const fr = formula;
  formulaUpdate(fr);
  console.log(formula.ingredients.baseNotes);
  console.log(formula.ingredients.heartNotes);
  console.log(formula.ingredients.topNotes);
  console.log(formula.ingredients.alcohol);
};

const submitData = async (payload) => {
  console.log("submit data");
  console.log(payload);
  console.log(formula.ingredients.heartNotes);
  console.log(formula.ingredients.topNotes);
  console.log(formula.ingredients.alcohol);
  console.log(formula);

  if (payload.version === formula.version) {
    console.log("no puede ser la misma");
    toast.warning("When copy formula ,version must be different!!", {
      duration: 4000,
    });

    return;
  }

  const data = {
    name: formula.name,
    status: formula.status,
    version: payload.version,
    comment: payload.comments,
    formulaIngredients: [],
  };
  let id_response = null;

  await customAxios({
    method: "post",
    url: `api/v1/formulas/add/` + payload.id,
    data: data,
  })
    .then((res) => {
      console.log(res.data);
      id_response = res.data.id;
      // this.$toast.success("Formula añadida correctamente", {
      //   duration: 2000,
      // });
    })
    .catch((error) => {
      console.error(error);
    });

  formula.ingredients.baseNotes.forEach((note) => {
    data.formulaIngredients.push({
      ingredientName: note.ingredientName,
      pyramidLevel: note.pyramidLevel,
      amount: note.amount,
      dilutionOfIngredient: note.dilutionOfIngredient,
      alcohol: note.alcohol,
    });
  });

  formula.ingredients.heartNotes.forEach((note) => {
    data.formulaIngredients.push({
      ingredientName: note.ingredientName,
      pyramidLevel: note.pyramidLevel,
      amount: note.amount,
      dilutionOfIngredient: note.dilutionOfIngredient,
      alcohol: note.alcohol,
    });
  });

  formula.ingredients.topNotes.forEach((note) => {
    data.formulaIngredients.push({
      ingredientName: note.ingredientName,
      pyramidLevel: note.pyramidLevel,
      amount: note.amount,
      dilutionOfIngredient: note.dilutionOfIngredient,
      alcohol: note.alcohol,
    });
  });

  formula.ingredients.alcohol.forEach((note) => {
    data.formulaIngredients.push({
      ingredientName: note.ingredientName,
      pyramidLevel: note.pyramidLevel,
      amount: note.amount,
      dilutionOfIngredient: note.dilutionOfIngredient,
      alcohol: note.alcohol,
    });
  });

  console.log(data);
  console.log(data.formulaIngredients);

  await customAxios({
    method: "post",
    url: `api/v1/formula-ingredient/ingredients/` + id_response,
    data: data.formulaIngredients,
  })
    .then((res) => {
      console.log(res.data);
      if (!payload.comments) {
        toast.success("Formula added", {
          duration: 2000,
        });
        router.go(-1)
      }
    })
    .catch((error) => {
      console.error(error);
    });

  if (payload.comments) {
    await customAxios({
      method: "post",
      url: `api/v1/comments/` + id_response,
      data: {
        body: payload.comments,
      },
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((res) => {
        console.log(res.data);
        toast.success("Formula added", {
          duration: 2000,
        });
        router.go(-1)
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
</script>
<style scoped>
table {
  border-collapse: collapse;
}
</style>
