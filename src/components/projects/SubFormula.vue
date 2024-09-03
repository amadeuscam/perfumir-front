<template>
  <div class="make_nice mt-5" style="position: relative; margin: 120px 0">
    <button class="btn btn-md btn-danger" style="position: absolute; top: -41px; right: -4px" @click="deleteFormula"><v-icon name="ri-delete-bin-3-line" /> Delete Version Formula</button>
    <div class="row">
      <div class="col-12 col-md-10">
        <div class="d-flex flex-md-row flex-column text-center justify-content-between align-items-center h-100">
          <h6>
            Total (gr): <br />

            <span style="font-size: 2rem">{{ formula_pr.total.toFixed(3) }}</span>
          </h6>
          <h6>
            Concentrate: <br />
            <span style="font-size: 2rem">{{ formula_pr.concentrate.toFixed(3) }}</span>
          </h6>
          <h6>
            Final Concentrate: <br />
            <span style="font-size: 2rem"> {{ formula_pr.final_concentrate_perfume.toFixed(2) }}</span>
          </h6>
          <h6>
            Created at: <br />
            <span style="font-size: 2rem"> {{ formatDate(formula_pr.created) }}</span>
          </h6>
          <h6>
            Nr.Ingredients: <br />
            <span style="font-size: 2rem"> {{ formula_pr.totalIngredients }}</span>
          </h6>
          <!-- <h6>
            Last Update: <br />
            <span style="font-size: 2rem"> {{ formatDate(formula_pr.updated) }}</span>
          </h6> -->
          <h6>
            Version <br />
            <span style="font-size: 2rem; color: red"> {{ formula_pr.version }}</span>
          </h6>
          <h6 v-if="others.raw_formula">
            <router-link :to="'/formula/copy/' + fmanagementId + '/' + others.raw_formula.id" class="btn btn-md btn-dark mb-3"
              ><v-icon style="margin-right: 5px" name="ri-file-copy-line" /><span>Copy Formula</span></router-link
            >
          </h6>
        </div>
      </div>

      <div class="col-12 col-md-2">
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="name" placeholder="coumarin" required v-model="formula_pr.ppt" @change.prevent="updatePPT()" />
          <label for="name">PPT * </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-8">
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
            <tr class="shaded" v-if="formula_pr.basenote.amount">
              <td scope="row">BASE NOTES</td>
              <td></td>
              <td>{{ formula_pr.basenote.amount.toFixed(3) }}</td>
              <td>{{ formula_pr.basenote.rel.toFixed(2) }}</td>
              <td>{{ formula_pr.basenote.abs.toFixed(2) }}</td>
              <td>{{ formula_pr.basenote.ppt.toFixed(0) }}</td>
            </tr>
            <tr v-for="(baseNote, index) in others.baseNotes" :key="index" style="position: relative">
              <th scope="row">
                <span>{{ baseNote.ingredientName }}</span>
              </th>
              <td>{{ baseNote.dilutionOfIngredient.toFixed(0) }}</td>
              <td>{{ baseNote.amount.toFixed(3) }}</td>
              <td>{{ baseNote.rel.toFixed(2) }}</td>
              <td>{{ baseNote.abs.toFixed(2) }}</td>
              <td>{{ baseNote.ppt.toFixed(0) }}</td>
            </tr>

            <tr class="heart" v-if="formula_pr.heartnote.amount">
              <td scope="row">HEART NOTES</td>
              <td></td>
              <td>{{ formula_pr.heartnote.amount.toFixed(3) }}</td>
              <td>{{ formula_pr.heartnote.rel.toFixed(2) }}</td>
              <td>{{ formula_pr.heartnote.abs.toFixed(2) }}</td>
              <td>{{ formula_pr.heartnote.ppt.toFixed(0) }}</td>
            </tr>
            <tr v-for="(heartNote, index) in others.heartNotes" :key="index">
              <th scope="row">
                {{ heartNote.ingredientName }}
              </th>

              <td>{{ heartNote.dilutionOfIngredient.toFixed(0) }}</td>
              <td>{{ heartNote.amount.toFixed(3) }}</td>
              <td>{{ heartNote.rel.toFixed(2) }}</td>
              <td>{{ heartNote.abs.toFixed(2) }}</td>
              <td>{{ heartNote.ppt.toFixed(0) }}</td>
            </tr>

            <tr class="top" v-if="formula_pr.topnote.amount">
              <td scope="row">TOP NOTES</td>
              <td></td>
              <td>{{ formula_pr.topnote.amount.toFixed(3) }}</td>
              <td>{{ formula_pr.topnote.rel.toFixed(2) }}</td>
              <td>{{ formula_pr.topnote.abs.toFixed(2) }}</td>
              <td>{{ formula_pr.topnote.ppt.toFixed(0) }}</td>
            </tr>
            <tr v-for="(topNote, index) in others.topNotes" :key="index">
              <th scope="row">
                {{ topNote.ingredientName }}
              </th>

              <td>{{ topNote.dilutionOfIngredient.toFixed(0) }}</td>
              <td>{{ topNote.amount.toFixed(3) }}</td>
              <td>{{ topNote.rel.toFixed(2) }}</td>
              <td>{{ topNote.abs.toFixed(2) }}</td>
              <td>{{ topNote.ppt.toFixed(0) }}</td>
            </tr>

            <tr class="alch" v-if="formula_pr.alch.amount">
              <td scope="row">Alchool</td>
              <td></td>
              <td>{{ formula_pr.alch.amount.toFixed(3) }}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr v-for="(alchool, index) in others.Alchool" :key="index">
              <th scope="row">
                {{ alchool.ingredientName }}
              </th>
              <td>{{ alchool.dilutionOfIngredient }}</td>

              <td>{{ alchool.amount.toFixed(3) }}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-12 col-md-4 make_nice_cmon">
        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-dark" type="button" data-bs-toggle="offcanvas" :data-bs-target="'#offcanvasRight' + formula_pr.id" aria-controls="offcanvasRight">
                Comments / Notes ({{ others.comentarios.length }})
              </button>
              <v-icon style="margin-right: 5px; cursor: pointer" name="ri-add-circle-line" class="text-success" scale="1.8" data-bs-toggle="modal" :data-bs-target="'#modalAddComments' + formula_pr.id" />
            </div>
          </div>
          <div class="col-12 mt-5" style="font-size: 14px">
            <h4 class="text-secondary">Changes</h4>
            <hr />

            <div v-if="changes.values.added && changes.values.added.length > 0">
              <h5 class="text-center">Added</h5>

              <table class="table table-success">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Amount</th>
                    <th scope="col">PyramidLevel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="add in changes.values.added">
                    <th scope="row">
                      {{ add.ingredientName }}
                    </th>

                    <td>{{ add.amount.toFixed(3) }}</td>
                    <td :style="{ backgroundColor: calculateColor(add.pyramidLevel), color: 'black' }">{{ add.pyramidLevel }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="changes.values.removed && changes.values.removed.length > 0">
              <h5 class="text-center">Removed</h5>
              <table class="table table-danger">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">amount</th>
                    <th scope="col">PyramidLevel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="add in changes.values.removed">
                    <th scope="row">
                      {{ add.ingredientName }}
                    </th>

                    <td>{{ add.amount.toFixed(3) }}</td>
                    <td :style="{ backgroundColor: calculateColor(add.pyramidLevel), color: 'black' }">{{ add.pyramidLevel }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="changes.values.changed && changes.values.changed.length > 0">
              <h5 class="text-center">Change</h5>

              <table class="table table-warning">
                <thead>
                  <tr>
                    <th scope="col">Name</th>

                    <th scope="col">Old Amount</th>
                    <th scope="col">New Amount</th>
                    <th scope="col">PyramidLevel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="add in changes.values.changed">
                    <th scope="row">
                      {{ add.old.ingredientName }}
                    </th>

                    <td>{{ add.old.amount.toFixed(3) }}</td>
                    <td>
                      {{ add.new.amount.toFixed(3) }} -> <span style="margin-left: 5px; font-size: 12px">{{ add.new.amount > add.old.amount ? "more" : "less" }}</span>
                    </td>
                    <td :style="{ backgroundColor: calculateColor(add.old.pyramidLevel), color: 'black' }">{{ add.old.pyramidLevel }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="offcanvas offcanvas-end" tabindex="-1" :id="'offcanvasRight' + formula_pr.id" aria-labelledby="offcanvasRightLabel">
    <div class="offcanvas-header">
      <h5 id="offcanvasRightLabel">Comments / Notes</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="row">
        <div class="col-12 mb-3" v-for="comment in others.comentarios">
          <div class="card">
            <h5 class="card-header d-flex justify-content-between align-items-center">
              {{ formatDate(comment.created) }}
              <v-icon name="ri-delete-bin-3-line" style="cursor: pointer" scale="1.2" class="text-danger" @click="deleteComment(comment)" />
            </h5>
            <div class="card-body">
              <p>{{ comment.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" :id="'modalAddComments' + formula_pr.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalAddProjectLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">+ Comments / Notes</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label">Content:</label>
              <textarea v-model="others.comentario" class="form-control"></textarea>
              <input v-model="others.comIdHidden" type="hidden" value="xm234jq" />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> -->

          <button type="button" class="btn btn-dark" data-bs-dismiss="modal" @click="addComment(formula.id)"><v-icon style="margin-right: 5px" name="ri-add-circle-line" /> Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";
import { defineEmits, defineProps, onMounted, reactive, watch } from "vue";

const props = defineProps({
  fmanagementId: Number,
  formula: Object,
});

watch(
  () => props.formula.comments,
  (first, second) => {
    console.log("Watch props.selected function called with args:", first, second);
    others.comentarios = first;
  },
  { deep: true }
);

const emit = defineEmits(["deleteFormula", "addComments", "removeComments"]);

onMounted(() => {
  const formula = JSON.parse(JSON.stringify(props.formula));

  // console.log(formula);
  // console.log(formula.added);
  // console.log(formula.changed);
  // console.log(formula.changed);
  changes.values.added = formula.added ? formula.added.sort((a, b) => (a.pyramidLevel > b.pyramidLevel ? 1 : -1)) : [];
  changes.values.changed = formula.changed ? formula.changed.sort((a, b) => (a.old.pyramidLevel > b.old.pyramidLevel ? 1 : -1)) : [];
  changes.values.removed = formula.removed ? formula.removed.sort((a, b) => (a.pyramidLevel > b.pyramidLevel ? 1 : -1)) : [];
  // console.log(changes.values);
  // console.log(formula);

  // formula.cambios.forEach(element => {
  //   delete element.cambios
  // });
  others.raw_formula = formula;
  formula_pr.name = formula.name;
  formula_pr.version = formula.version;
  formula_pr.created = formula.created;
  formula_pr.updated = formula.updated;
  formula_pr.id = formula.id;
  others.comIdHidden = formula.id;

  addIngredient(formula);
});

const others = reactive({
  formula_prop: null,
  dilutions: [],
  baseNotes: [],
  heartNotes: [],
  topNotes: [],
  Alchool: [],
  ingredientSelected: null,
  dilutionSelected: null,
  quantity: null,
  raw_formula: null,
  cambios: null,
  comentarios: [],
  comentario: "",
  comIdHidden: "",
});

const changes = reactive({
  values: {},
});

const formula_pr = reactive({
  name: null,
  total: 0,
  created: 0,
  updated: 0,
  concentrate: 0,
  ppt: 1000,
  version: null,
  comment: "",
  totalIngredients: 0,
  final_concentrate_perfume: 0,
  basenote: {
    ppt: 0,
    amount: 0,
    rel: 0,
    abs: 0,
  },
  heartnote: {
    ppt: 0,
    amount: 0,
    rel: 0,
    abs: 0,
  },
  topnote: {
    ppt: 0,
    amount: 0,
    rel: 0,
    abs: 0,
  },
  alch: {
    ppt: 0,
    amount: 0,
    rel: 0,
    abs: 0,
  },
});

const addComment = (ev) => {
  // console.log(ev);
  // console.log(others.comentario);
  // console.log(formula_pr.id);
  // console.log(others.raw_formula);

  const payload = {
    id: ev,
    body: others.comentario,
  };
  // console.log(payload);

  emit("addComments", payload);
  others.comentario = "";
};

const deleteComment = (comment) => {

  const payload = {
    formulaId: others.raw_formula.id,
    commentId: comment.id,
  };

  emit("removeComments", payload);
};

const addIngredient = (formula) => {
  console.log(formula);

  // formula_pr.comment = formula.comment;
  others.comentarios = formula.comments;

  formula.formulaIngredients.forEach((element) => {
    const quantityAdd = Number(element.amount);

    const ingredientFormula = {
      ingredientName: element.ingredientName,
      pyramidLevel: element.pyramidLevel,
      amount: quantityAdd,
      dilutionOfIngredient: element.dilutionOfIngredient,
      alcohol: element.alcohol,
      ppt: 0,
      material_raw: 0,
      rel: 0,
      abs: 0,
    };

    switch (element.pyramidLevel) {
      case "base":
        others.baseNotes.push(precalculate(ingredientFormula));
        break;
      case "heart":
        others.heartNotes.push(precalculate(ingredientFormula));
        break;
      case "top":
        others.topNotes.push(precalculate(ingredientFormula));
        break;
      case "alch":
        others.Alchool.push(precalculate(ingredientFormula));
        break;
      default:
        break;
    }
  });

  formula_pr.total = formula_pr.basenote.amount + formula_pr.heartnote.amount + formula_pr.topnote.amount + formula_pr.alch.amount;

  updatePPTS();
};

const calculateColor = (level) => {
  switch (level) {
    case "base":
      return "#4ca894";
    case "heart":
      return "#eef111";
    case "top":
      return "#f15811";

    default:
      break;
  }
};
const formatDate = (date) => {
  return moment(date).format("LLL");
};

const deleteFormula = () => {
  const payload = {
    managementId: props.fmanagementId,
    formulaId: others.raw_formula.id,
  };
  emit("deleteFormula", payload);
};

const precalculate = (ingredient) => {
  const material_raw = ingredient.amount - (ingredient.amount * ingredient.alcohol) / 100;
  if (ingredient.pyramidLevel !== "alch") {
    formula_pr.concentrate += material_raw;
  }
  const ppts = (formula_pr.ppt / formula_pr.concentrate) * material_raw;
  ingredient.ppt = ppts;
  ingredient.material_raw = material_raw;

  switch (ingredient.pyramidLevel) {
    case "base":
      formula_pr.basenote.amount += ingredient.amount;
      break;
    case "heart":
      formula_pr.heartnote.amount += ingredient.amount;
      break;
    case "top":
      formula_pr.topnote.amount += ingredient.amount;
      break;
    case "alch":
      formula_pr.alch.amount += ingredient.amount;
      break;
    default:
      break;
  }

  return ingredient;
};

const updatePPTS = () => {
  others.baseNotes = recalculateIngredients(others.baseNotes, "base");
  others.heartNotes = recalculateIngredients(others.heartNotes, "heart");
  others.topNotes = recalculateIngredients(others.topNotes, "top");

  formula_pr.totalIngredients = others.baseNotes.length + others.heartNotes.length + others.topNotes.length + others.Alchool.length;

  formula_pr.final_concentrate_perfume = (((100 / formula_pr.total) * formula_pr.concentrate) / 100) * 100;
};

const recalculateIngredients = (notes, piramidLevel) => {
  const ppts = formula_pr.ppt / formula_pr.concentrate;

  notes = notes.map((note) => (true ? { ...note, ppt: ppts * note.material_raw } : note));
  notes = notes.map((note) => (true ? { ...note, rel: (note.material_raw / formula_pr.total) * 100 } : note));
  notes = notes.map((note) =>
    true
      ? {
          ...note,
          abs: (note.material_raw / formula_pr.concentrate) * 100,
        }
      : note
  );

  switch (piramidLevel) {
    case "base":
      formula_pr.basenote.ppt = notes.reduce((n, { ppt }) => n + ppt, 0);
      formula_pr.basenote.rel = notes.reduce((n, { rel }) => n + rel, 0);
      formula_pr.basenote.abs = notes.reduce((n, { abs }) => n + abs, 0);
      break;
    case "heart":
      formula_pr.heartnote.ppt = notes.reduce((n, { ppt }) => n + ppt, 0);
      formula_pr.heartnote.rel = notes.reduce((n, { rel }) => n + rel, 0);
      formula_pr.heartnote.abs = notes.reduce((n, { abs }) => n + abs, 0);
      break;
    case "top":
      formula_pr.topnote.ppt = notes.reduce((n, { ppt }) => n + ppt, 0);
      formula_pr.topnote.rel = notes.reduce((n, { rel }) => n + rel, 0);
      formula_pr.topnote.abs = notes.reduce((n, { abs }) => n + abs, 0);
      break;

    default:
      break;
  }

  return notes;
};
const updatePPT = () => {
  updatePPTS();
};
</script>

<style>
.make_nice {
  border: 2px dashed rgb(189, 187, 187);
  padding: 1rem;
}
.make_nice_cmon {
  border: 2px dashed rgb(21, 22, 21);
  padding: 1rem;
}

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
