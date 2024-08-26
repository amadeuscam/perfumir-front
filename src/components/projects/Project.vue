<template>
  <div class="container-fluid">
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-dark btn-large my-3" data-bs-toggle="modal" data-bs-target="#modalAddProject">
      <v-icon style="margin-right: 5px" name="ri-add-circle-line" />Add project
    </button>

    <!-- Modal -->
    <div class="modal fade" id="modalAddProject" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalAddProjectLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Add Project</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Name:</label>
                <input type="text" v-model="storage.projectName" class="form-control" id="recipient-name" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> -->
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal" @click="createProject($event)"><v-icon style="margin-right: 5px" name="ri-add-circle-line" /> Add Project</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalAddFormula" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalAddFormulaLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Add Formula</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Name:</label>
                <input type="text" v-model="storage.formulaName" class="form-control" id="recipient-name" />
              </div>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Status</label>
                <select class="form-select" v-model="storage.formulaStaus" aria-label="Default select example">
                  <!-- <option selected>Open this select menu</option> -->
                  <option selected value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Version:</label>
                <input type="text" v-model="storage.formulaVersion" class="form-control" id="recipient-name" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> -->
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal" @click="createFormula($event)"><v-icon style="margin-right: 5px" name="ri-add-circle-line" /> Add Formula</button>
          </div>
        </div>
      </div>
    </div>

    <Eror :error="storage.error" v-if="storage.error" />
    <div class="row row-cols-1 row-cols-md-3 g-4 mb-5">
      <div class="col" v-for="project in storage.projects" :key="project.id">
        <div class="card h-100 crd-vh">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-between align-items-center">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-decoration-underline">{{ project.name }} </span>
                <v-icon style="margin-left: 15px; color: red; cursor: pointer" name="ri-delete-bin-3-line" scale="1.1" @click="deleteProject(project.id)" />
              </div>

              <span title="Cas number" class="text-black-50">{{ formatDate(project.created) }}</span>
            </h5>
            <div class="card-text">
              <div class="row mt-3">
                <div class="col-12 col-md-12 text-justify">
                  <div class="d-flex justify-content-between align-items-center">
                    <h4 class="m-0">Formulas</h4>
                    <button type="button" class="btn btn-dark btn-large" data-bs-toggle="modal" data-bs-target="#modalAddFormula" @click="storage.projectId = project.id">
                      <v-icon style="margin-right: 5px" name="ri-add-circle-line" />Add Formula
                    </button>
                  </div>

                  <span class="badge bg-dark mt-4" style="margin: 0 10px" v-for="formula in project.formulasManagement" :key="formula.id">
                    <router-link style="color: white; font-size: 1.4em" :to="'/formula/' + project.id + '/formulaview/' + formula.id">{{ formula.name }}</router-link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import customAxios from "../../axios";
import Eror from "../Eror.vue";

const toast = useToast();
const router = useRouter();

onMounted(() => {
  getProjects();
});
const storage = reactive({
  projects: [],
  formulas: [],
  projectName: "",
  projectId: null,
  formulaName: "",
  formulaStaus: "in_progress",
  formulaVersion: "",
  error: "",
});

const getProjects = async () => {
  await customAxios({
    method: "get",
    url: "api/v1/projects",
  })
    .then((res) => {
      storage.projects = res.data;
    })
    .catch((error) => {
      storage.error = error.response.data.message;
    });
};
const createProject = async (e) => {
  console.log(e);
  // return
  if (storage.projectName.length == 0) {
    return;
  }
  await customAxios({
    method: "post",
    url: "api/v1/projects",
    data: { name: storage.projectName },
  })
    .then((res) => {
      storage.projects.push(res.data);
    })
    .catch((error) => {
      storage.error = error.response.data.message;
    });
};
const createFormula = async (e) => {
  // console.log(e);
  // console.log(storage.projectId);
  // console.log(storage.formulaName);
  // console.log(storage.formulaStaus);
  // console.log(storage.formulaVersion);
  // return;
  if (storage.formulaName.length == 0 || storage.formulaStaus.length == 0 || storage.formulaVersion.length == 0) {
    return;
  }
  await customAxios({
    method: "post",
    url: "api/v1/formula-management/add/" + storage.projectId,
    data: {
      name: storage.formulaName,
      status: storage.formulaStaus,
      version: storage.formulaVersion,
    },
  })
    .then((res) => {
      router.push(`/formula/${storage.projectId}/formulaview/${res.data.id}`).then(() => {
        router.go(0);
      });

      // this.projects.push(res.data);
    })
    .catch((error) => {
      storage.error = error.response.data.message;
    });
};

const deleteProject = async (id) => {
  console.log(id);
  let message = "This project will be deleted and all his formulas will be deleted,are you sure?";
  if (confirm(message) == true) {
    await customAxios({
      method: "delete",
      url: "api/v1/projects/" + id,
    })
      .then((res) => {
        if (res.status == 204) {
          let objIndex = storage.projects.findIndex((obj) => obj.id == id);
          storage.projects.splice(objIndex, 1);

          toast.success("Successfully deleted project", {
            position: "top-right",
            duration: 2000,
          });
        }
      })
      .catch((error) => {
        storage.error = error.response.data.message;
      });
  }
};

const formatDate = (date) => {
  return moment(date).format("LL");
};
</script>

<style scoped>
.crd-vh:hover {
  transition: 0.5s;
  box-shadow: 10px 10px #ff0;
}
</style>
