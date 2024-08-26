<template>
  <tr :class="piramid.classFor" v-if="piramid.amount">
    <td scope="row">{{ title }}</td>
    <td></td>
    <td>{{ piramid.amount.toFixed(3) }}</td>
    <td>{{ piramid.rel.toFixed(2) }}</td>
    <td>{{ piramid.abs.toFixed(2) }}</td>
    <td>{{ piramid.ppt.toFixed(0) }}</td>
  </tr>
  <tr v-for="(baseNote, index) in piramid.data" :key="index" style="position: relative">
    <th scope="row">
      <v-icon name="ri-close-circle-line" scale="1" fill="red" hover style="margin-right: 10px; cursor: pointer" @click="removeIngredient(baseNote)" title="Delete Ingredient" />
      <span>{{ baseNote.ingredientName }}</span>
    </th>
    <td style="width: 15% !important">
      <input type="text" class="form-control" :value="baseNote.dilutionOfIngredient" v-if="status != 'done'" @change="updateIngredient($event, baseNote, 'dilutionOfIngredient')" style="width: 100%" />

      <input
        type="text"
        class="form-control"
        :value="baseNote.prodDilutionOfIngredient"
        v-if="status == 'done'"
        @change="updateIngredient($event, baseNote, 'dilutionOfIngredient')"
        style="width: 100%"
      />
    </td>

    <td style="width: 15% !important">
      <input type="text" class="form-control" @change="updateIngredient($event, baseNote, 'amount')" :value="baseNote.amount.toFixed(3)" style="width: 100%" v-if="status != 'done'" />

      <input type="text" class="form-control" v-if="status == 'done' && baseNote.amountToUse" :value="baseNote.amountToUse.toFixed(3)" style="width: 100%" :disabled="status == 'done'" />
    </td>

    <td>
      <p>{{ baseNote.rel.toFixed(2) }}</p>
      <p v-if="baseNote.ifra && checkIfra(baseNote.rel, baseNote.ifra)" :style="[checkIfra(baseNote.rel, baseNote.ifra) ? { color: 'red' } : {}]">Ifra Limit {{ baseNote.ifra }}</p>
    </td>
    <td>{{ baseNote.abs.toFixed(2) }}</td>
    <td>{{ baseNote.ppt.toFixed(0) }}</td>
  </tr>
</template>

<script setup>
import { defineProps, onMounted, reactive, watch } from "vue";

const props = defineProps({
  ingredient: Array,
  status: String,
  formula: Object,
  formulaProduction: Object,
  title: String,
});

const emit = defineEmits(["updateFormula", "updateFormulaProduction", "updateIngredient", "removeIngredient"]);

watch(
  () => props,
  (first, second) => {
    console.log("Watch props.selected function called with args:", first, second);
    // console.log(piramid.classFor);
    // console.log(first.title);

    if (first.formula.status !== "done") {
      piramid.formula = first.formula;
    } else {
      piramid.formula = first.formula;
      piramid.formulaProd = first.formulaProduction;
    }

    piramid.data = first.ingredient;

    recalculateIngredients(piramid.data);
  },
  { deep: true }
);

onMounted(() => {
  // console.log(props);

  if (props.title.includes("Base")) {
    piramid.classFor = "shaded";
  }

  if (props.title.includes("Heart")) {
    piramid.classFor = "heart";
  }
  if (props.title.includes("Top")) {
    piramid.classFor = "top";
  }
});

const piramid = reactive({
  ppt: 0,
  amount: 0,
  rel: 0,
  abs: 0,
  data: [],
  formula: {},
  formulaProd: {},
  classFor: "",
});

const removeIngredient = (ingredient) => {
  const payload = {
    ingredient: ingredient,
  };

  emit("removeIngredient", payload);
};

const updateIngredient = (event, ingredient, scope) => {
  const payload = {
    value: Number(event.target.value),
    ingredient: ingredient,
    scope: scope,
  };

  emit("updateIngredient", payload);
};

const recalculateIngredients = (notes) => {
  console.log(notes);
  console.log(piramid.formula.status);

  if (props.status !== "done") {
    const ppts = piramid.formula.ppt / piramid.formula.concentrate;

    piramid.amount = piramid.data.reduce((n, { amount }) => n + amount, 0);
    notes = notes.map((note) => (true ? { ...note, ppt: ppts * note.material_raw } : note));
    notes = notes.map((note) => (true ? { ...note, rel: (note.material_raw / piramid.formula.total) * 100 } : note));
    notes = notes.map((note) =>
      true
        ? {
            ...note,
            abs: (note.material_raw / piramid.formula.concentrate) * 100,
          }
        : note
    );

    piramid.ppt = notes.reduce((n, { ppt }) => n + ppt, 0);
    piramid.rel = notes.reduce((n, { rel }) => n + rel, 0);
    piramid.abs = notes.reduce((n, { abs }) => n + abs, 0);

    piramid.data = notes;
  } else {
    console.log(piramid.formulaProd);

    const ppts = piramid.formula.ppt / piramid.formulaProd.currentAmountOfConcentrate;
    piramid.amount = piramid.data.reduce((n, { amountToUse }) => n + amountToUse, 0);
    notes = notes.map((note) => (true ? { ...note, ppt: ppts * note.materialDoneRaw } : note));
    notes = notes.map((note) => (true ? { ...note, rel: (note.materialDoneRaw / piramid.formulaProd.totalAmount) * 100 } : note));
    notes = notes.map((note) =>
      true
        ? {
            ...note,
            abs: (note.materialDoneRaw / piramid.formulaProd.currentAmountOfConcentrate) * 100,
          }
        : note
    );

    piramid.ppt = notes.reduce((n, { ppt }) => n + ppt, 0);
    piramid.rel = notes.reduce((n, { rel }) => n + rel, 0);
    piramid.abs = notes.reduce((n, { abs }) => n + abs, 0);

    piramid.data = notes;
    console.log(piramid.data);
  }
};

const checkIfra = (abs, ifra) => {
  if (ifra) {
    return abs > Number(ifra);
  }
  return false;
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}

tr.shaded td {
  background-color: #4ca894 !important;
  color: black;
  font-weight: bold;
}

tr.heart td {
  background-color: #eef111 !important;
  color: black;
  font-weight: bold;
}

tr.top td {
  background-color: #f15811 !important;
  color: black;
  font-weight: bold;
}

tr.alch td {
  background-color: #118cf1 !important;
  color: black;
  font-weight: bold;
}
</style>
