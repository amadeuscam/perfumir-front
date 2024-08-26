import axios from "axios";

const customAxios = axios.create({
  baseURL: "http://localhost:8080/",
});

customAxios.interceptors.request.use(
  async (config) => {
    if (config.headers) {
      if (config.url !== "api/auth/signin") {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (401 === error.response.status) {
      console.log(error);
      localStorage.removeItem("token");
      localStorage.removeItem("current_user");
      location.reload();
      this.$router.push("/login").then(() => {
        this.$router.go(0);
      });
      // await axios({
      //   method: "post",
      //   url: "http://localhost:8080/api/auth/refresh-token",
      //   data: { token: refreshToken },
      // }).then((res) => {
      //   console.log(res);
      //   localStorage.setItem("token", res.data.token);
      //   localStorage.setItem("refreshToken", res.data.refreshToken);
      //   customAxios.defaults.headers.common[
      //     "Authorization"
      //   ] = `Bearer ${res.token}`;
      //   return res;
      // });
    } else {
      return Promise.reject(error.response.data);
    }
  }
);

export default customAxios;

// localStorage.getItem("token")
//   ? (axios.defaults.headers.common["Authorization"] =
//       "Bearer " + localStorage.getItem("token"))
//   : "";
