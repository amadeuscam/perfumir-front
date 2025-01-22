<template>
  <div class="row mt-3">
    <div class="col-12 col-md-12">
      <div class="row">
        <div class="col-12 col-md-4">
          <button class="btn btn-md btn-dark mb-3" @click.prevent="$router.go(-1)"><v-icon
              name="ri-arrow-go-back-line" /> Go Back</button>
        </div>
        <div class="col-12 col-md-4 mb-2 text-center">
          <h2>{{ fvData.formulaName }}</h2>
          <button class="btn btn-md btn-danger mb-3" @click="deleteFormulaManagement(fvData.fmanagement_id)"><v-icon
              name="ri-delete-bin-3-line" /> Delete formula</button>
        </div>
        <div class="col-12 col-md-4" style="text-align: right">
          <router-link :to="'/formula/' + fvData.fmanagement_id" class="btn btn-md btn-dark mb-3"
            v-if="fvData.formulas.length > 0"><v-icon style="margin-right: 5px" name="ri-add-circle-line" /><span>Add
              Another Version</span></router-link>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-12">

      <SubFormula :formula="formula" v-for="formula in fvData.formulas" :fmanagementId="fvData.fmanagement_id"
        :key="formula.id" v-if="fvData.formulas.length > 0" @deleteFormula="removeFormula" @addComments="addComment"
        @removeComments="deleteComments" />

      <div class="notFormulaContainer" v-if="fvData.formulas.length == 0">
        <router-link :to="'/formula/' + fvData.fmanagement_id" class="btn btn-md btn-dark mb-3">
          <v-icon style="margin-right: 5px" name="ri-add-circle-line" /><span>Add Version of
            Formula</span></router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from "vue";

import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import customAxios from "../../axios";
import SubFormula from "./SubFormula.vue";

const toast = useToast();
const route = useRoute();
const router = useRouter();

const fvData = reactive({
  formulaName: null,
  formulas: [],
  fmanagement_id: null,
  project_id: null,
});

onMounted(() => {
  fvData.project_id = route.params.project_id;
  fvData.fmanagement_id = Number(route.params.formula_id);
  getFormula(route.params.formula_id);
  getFormulaMng(route.params.formula_id, route.params.project_id);
});

const getFormula = async (formula_id) => {
  await customAxios({
    method: "get",
    url: `api/v1/formulas/formulas-per-formula-management/${formula_id}`,
  })
    .then((res) => {
      let formulas = res.data.sort(function (a, b) {
        return new Date(b.created) - new Date(a.created);
      });

      fvData.formulas = formulas;
      calculateChanges(fvData.formulas);
    })
    .catch((error) => {
      console.error(error);
    });

  console.log(fvData.formulas);
};

const deleteFormulaManagement = async (id) => {
  console.log(id);
  console.log(fvData.project_id);
  let message = "All versions of the formula will be removed and the formula itself from the project, are you sure?";
  if (confirm(message) == true) {
    await customAxios({
      method: "delete",
      url: `api/v1/formula-management/${fvData.project_id}/${id}`,
    })
      .then((res) => {
        console.log(res.data);
        router.push("/projects").then(() => {
          router.go(0);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

const addComment = async (payload) => {
  console.log(payload);

  await customAxios({
    method: "post",
    url: `api/v1/comments/` + payload.id,
    data: {
      body: payload.body,
    },
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((res) => {
      console.log(res.data);
      fvData.formulas.filter((em) => em.id == payload.id);
      let objIndex = fvData.formulas.findIndex((obj) => obj.id == payload.id);
      console.log(objIndex);
      console.log(fvData.formulas[objIndex]);
      fvData.formulas[objIndex].comments.push(res.data);

      // fvData.formulas.comments.push(res.data)
      toast.success("Comment added", {
        duration: 2000,
      });
    })
    .catch((error) => {
      console.error(error);
      toast.error(error, {
        duration: 2000,
      });
    });
};

const deleteComments = async (payload) => {
  console.log(payload);

  await customAxios({
    method: "delete",
    url: `api/v1/comments/${payload.formulaId}/${payload.commentId}`,
  })
    .then((res) => {
      console.log(res.data);
      console.log(res.status);
      let objIndex = fvData.formulas.findIndex((obj) => obj.id == payload.formulaId);
      let objIndexComment = fvData.formulas[objIndex].comments.findIndex((obj) => obj.id == payload.commentId);
      fvData.formulas[objIndex].comments.splice(objIndexComment, 1);

      // fvData.formulas.filter((em) => em.id == payload.id);
      // let objIndex = fvData.formulas.findIndex((obj) => obj.id == payload.id);
      // console.log(objIndex);
      // console.log(fvData.formulas[objIndex]);
      // fvData.formulas[objIndex].comments.push(res.data);

      // fvData.formulas.comments.push(res.data)
      toast.success("Comment deleted", {
        duration: 2000,
      });
    })
    .catch((error) => {
      console.error(error);
      toast.error(error, {
        duration: 2000,
      });
    });
};

const compareFormulas = (formula1, formula2) => {
  // Convert list of ingredients to objects keyed by ingredientName
  const ingredients1 = formula1.formulaIngredients.reduce((acc, ing) => {
    acc[ing.ingredientName] = ing;
    return acc;
  }, {});

  const ingredients2 = formula2.formulaIngredients.reduce((acc, ing) => {
    acc[ing.ingredientName] = ing;
    return acc;
  }, {});

  // Find ingredients that are in formula2 but not in formula1 (added)
  const addedIngredients = Object.keys(ingredients2).filter((name) => !ingredients1[name]);

  // Find ingredients that are in formula1 but not in formula2 (removed)
  const removedIngredients = Object.keys(ingredients1).filter((name) => !ingredients2[name]);

  // Find ingredients that are in both but have differences in their attributes (changed)
  const changedIngredients = Object.keys(ingredients1).filter((name) => {
    if (ingredients2[name]) {
      const id2 = ingredients2[name].id;
      const created2 = ingredients2[name].created;
      const updated2 = ingredients2[name].updated;

      delete ingredients2[name].id;
      delete ingredients2[name].created;
      delete ingredients2[name].updated;

      const id1 = ingredients1[name].id;
      const created1 = ingredients1[name].created;
      const updated1 = ingredients1[name].updated;

      delete ingredients1[name].id;
      delete ingredients1[name].created;
      delete ingredients1[name].updated;

      console.log(ingredients2[name]);
      console.log(ingredients1[name]);

      // Compare attributes (e.g., amount, dilution)
      const res = JSON.stringify(ingredients1[name]) !== JSON.stringify(ingredients2[name]);
      ingredients2[name].id = id2;
      ingredients2[name].created = created2;
      ingredients2[name].updated = updated2;

      ingredients1[name].id = id1;
      ingredients1[name].created = created1;
      ingredients1[name].updated = updated1;

      return res;
    }
    return false;
  });

  return {
    added: addedIngredients.map((name) => ingredients2[name]),
    removed: removedIngredients.map((name) => ingredients1[name]),
    changed: changedIngredients.map((name) => ({
      old: ingredients1[name],
      new: ingredients2[name],
    })),
  };
};

const calculateChanges = (formulas) => {
  for (let i = 0; i < formulas.length - 1; i++) {
    const formula1 = formulas[i];

    const formula2 = formulas[i + 1];
    const differences = compareFormulas(formula2, formula1);

    const cambios = {
      added: differences.added,
      changed: differences.changed,
      removed: differences.removed,
    };

    Object.assign(fvData.formulas[i], cambios);
  }
};

const getFormulaMng = async (formula_id, project_id) => {
  await customAxios({
    method: "get",
    url: `api/v1/formula-management/${formula_id}/${project_id}`,
  })
    .then((res) => {
      const { id, name } = res.data;
      fvData.fmanagement_id = id;
      fvData.formulaName = name;
    })
    .catch((error) => {
      console.error(error);
    });
};

const removeFormula = async (payload) => {
  let objIndex = fvData.formulas.findIndex((obj) => obj.id == payload.formulaId);
  fvData.formulas.splice(objIndex, 1);
  await customAxios({
    method: "delete",
    url: `api/v1/formulas/${payload.managementId}/${payload.formulaId}`,
  })
    .then((res) => {
      // console.log(res.data);
      toast.success("Successfully deleted formula", {
        position: "top-right",
        duration: 2000,
      });
    })
    .catch((error) => {
      console.error(error);
    });
};
</script>
<style scoped>
.notFormulaContainer {
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed gray;
  margin-top: 4vh;
}
</style>
