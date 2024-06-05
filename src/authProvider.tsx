// Authenticated by default
export default {
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
    localStorage.setItem("not_authenticated", "true");
    localStorage.removeItem("role");
    localStorage.removeItem("login");
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
    localStorage.removeItem("netmusic");
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  checkError: ({ status }: any) => {
    return status === 401 || status === 403
      ? Promise.reject()
      : Promise.resolve();
  },
  checkAuth: () => {
    // return localStorage.getItem("not_authenticated")
    //   ? Promise.reject()
    //   : Promise.resolve();
    return Promise.resolve();
  },
  getPermissions: () => {
    const role = localStorage.getItem("role");
    return Promise.resolve(role);
  },
  getIdentity: () => {
    return Promise.resolve({
      id: localStorage.getItem("login"),
      fullName: localStorage.getItem("user"),
      avatar: localStorage.getItem("avatar"),
    });
  },
};
