import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/";
localStorage.getItem("token")
  ? (axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("token"))
  : "";
