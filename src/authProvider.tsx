import { AuthProvider, fetchUtils } from "react-admin";

const Auth: AuthProvider = {
  login: ({ username, password }: any) => {
    const request = new Request("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ code, message, data }) => {
        // store the token in local storage
        if (code >= 0) {
          localStorage.setItem("token", data);
          localStorage.removeItem("not_authenticated");
          localStorage.removeItem("role");
          localStorage.setItem("user", username);
        } else {
          throw new Error(message);
        }
      })
      .catch((message) => {
        throw new Error(message);
      });
  },
  logout: () => {
    doLogout();
    return Promise.resolve();
  },
  checkError: ({ status }: any) => {
    return status === 401 || status === 403
      ? Promise.reject()
      : Promise.resolve();
  },
  checkAuth: () => {
    // const token = localStorage.getItem("token");
    // let options: any = {};
    // options.headers = new Headers({ Accept: "application/json" });
    // options.headers.set("Access-Token", `${token}`);
    // return fetchUtils
    //   .fetchJson("/api/isAuthToken", options)
    //   .then(({ json }) => {
    //     if (json.code < 0) {
    //       doLogout();
    //       return Promise.reject({ message: "登录过期" });
    //     } else {
    //       return Promise.resolve();
    //     }
    //   })
    //   .catch(() => {
    //     doLogout();
    //     Promise.reject({ message: "登录过期" });
    //   });
    return Promise.resolve();
  },
  getPermissions: () => {
    // const role = localStorage.getItem("role");
    // return Promise.resolve(role);
    return Promise.resolve();
  },
  getIdentity: () => {
    let item = localStorage.getItem("login");
    let fullName = localStorage.getItem("user");
    let avatar = localStorage.getItem("avatar");
    return Promise.resolve({
      id: item != null ? item : "",
      fullName: fullName != null ? fullName : undefined,
      avatar: avatar != null ? avatar : undefined,
    });
  },
};

function doLogout(): void {
  localStorage.setItem("not_authenticated", "true");
  localStorage.removeItem("role");
  localStorage.removeItem("login");
  localStorage.removeItem("user");
  localStorage.removeItem("avatar");
  localStorage.removeItem("netmusic");
  localStorage.removeItem("token");
}

export default Auth;
