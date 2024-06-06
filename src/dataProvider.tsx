import { DataProvider, fetchUtils, withLifecycleCallbacks } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import querystring from "querystring";

export const accessTokenClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("token");
  options.headers.set("Access-Token", `${token}`);
  return fetchUtils.fetchJson(url, options);
};

const tokenNotifyClient = (url: string, options: any = {}) =>
  accessTokenClient(url, options).then(({ json, headers, body, status }) => {
    if (json.code < 0) {
      throw new Error(json.message);
    }
    return { json: json.data, headers, body, status };
  });

const withLifeCycleCallbackProvider = withLifecycleCallbacks(
  simpleRestProvider("/api", tokenNotifyClient),
  []
);

const dataProvider: DataProvider = {
  ...withLifeCycleCallbackProvider,
  get: (resource: string, params: any) => {
    let url = "/api/" + resource + "?" + querystring.stringify(params);
    return accessTokenClient(url)
      .then(({ json }) => {
        if (json.code !== 0) {
          return Promise.reject(Error(json.message));
        }
        return json;
      })
      .catch((reason) => {
        return Promise.reject(reason);
      });
  },
  post: (resource: string, params: any) => {
    let url = "/api/" + resource;
    return accessTokenClient(url, {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then(({ json }) => {
        if (json.code !== 0) {
          return Promise.reject(Error(json.message));
        }
        return json;
      })
      .catch((reason) => {
        return Promise.reject(reason);
      });
  },
  getList: (resource, params) => {
    if (resource === "uploadDetail") {
      const { page, perPage } = params.pagination;
      const filters = params.filter;
      const query = {
        ...filters,
        pageNo: page,
        pageSize: perPage,
      };
      const url = `/api/uploadDetail?${querystring.stringify(query)}`;
      return accessTokenClient(url).then(({ json }) => {
        return {
          data: json.data.records,
          total: json.data.total,
        };
      });
    }
    if (resource === "subscribe") {
      const { page, perPage } = params.pagination;
      const filters = params.filter;
      const query = {
        ...filters,
        pageNo: page,
        pageSize: perPage,
      };
      const url = `/api/subscribe?${querystring.stringify(query)}`;
      return accessTokenClient(url).then(({ json }) => {
        return {
          data: json.data.records,
          total: json.data.total,
        };
      });
    }
    return withLifeCycleCallbackProvider.getList(resource, params);
  },
  getOne: (resource, params: any) => {
    if (resource === "voiceList") {
      return accessTokenClient("/api/direct/voice/list/search").then(
        ({ json }) => {
          return {
            data: {
              voiceList: json.data,
              id: 1,
            },
          };
        }
      );
    }
    if (resource === "subscribe") {
      return accessTokenClient("/api/subscribe/detail?id=" + params.id).then(
        ({ json }) => {
          return {
            data: json.data,
          };
        }
      );
    }
    if (resource === "addToMy") {
      return withLifeCycleCallbackProvider.update("uploadDetail", params);
    }
    return withLifeCycleCallbackProvider.getOne(resource, params);
  },
  create: (resource, params): any => {
    if (resource === "uploadDetail") {
      return accessTokenClient("/api/uploadDetail/addQueue", {
        method: "POST",
        body: JSON.stringify(params.data),
      }).then(({ json }) => {
        return {
          data: { data: json, id: 1 },
        };
      });
    }
    if (resource === "test") {
      return new Promise(() =>
        setTimeout(() => {
          return Promise.resolve();
        }, 40000)
      );
    }
    if (resource === "loginPassword") {
      return accessTokenClient(
        `/api/direct/login/cellphone?${querystring.stringify(params.data)}`,
        {}
      ).then(({ json }) => {
        return {
          data: { data: json, id: 1 },
        };
      });
    }
    if (resource === "addToMy") {
      return accessTokenClient("/api/uploadDetail/addToMyList", {
        method: "POST",
        body: JSON.stringify(params.data),
      }).then(({ json }) => {
        return {
          data: { data: json, id: 1 },
        };
      });
    }
    return withLifeCycleCallbackProvider.create(resource, params);
  },
  update: (resource, params) => {
    return withLifeCycleCallbackProvider.update(resource, params);
  },
};

export default dataProvider;
