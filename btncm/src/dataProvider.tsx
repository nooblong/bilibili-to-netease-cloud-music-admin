import { fetchUtils, GetOneResult, DataProvider, HttpError, withLifecycleCallbacks } from 'react-admin';
import get from 'lodash/get';
import simpleRestProvider from 'ra-data-simple-rest';
import addUploadFeature from './addUploadFeature';
import moment from 'moment';

export const accessTokenClient = (url, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Access-Token', `${token}`);
    return fetchUtils.fetchJson(url, options);
};

const tokenNotifyClient = (url, options: any = {}) =>
    accessTokenClient(url, options).then(({ json, headers, body, status }) => {
        if (json.code < 0) {
            throw new Error(json.message);
        }
        return { json: json.data, headers, body, status };
    });

const withLifeCycleCallbackProvider = withLifecycleCallbacks(
    // 要用时加上
    // fakeRestProvider(data, true),
    simpleRestProvider('/api', tokenNotifyClient),
    [
        {
            resource: 'posts',
            beforeDelete: async ({ id }, dp) => {
                // delete related comments
                const { data: comments } = await dp.getList('comments', {
                    filter: { post_id: id },
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'id', order: 'DESC' },
                });
                await dp.deleteMany('comments', {
                    ids: comments.map(comment => comment.id),
                });
                return { id };
            },
        },
    ]
);

const dataProvider: DataProvider = {
    ...withLifeCycleCallbackProvider,
    getList: (resource, params) => {
        if (resource === 'recentsList') {
            const { page, perPage } = params.pagination;
            const filters = params.filter;
            const query = {
                ...filters,
                pageNo: page,
                pageSize: perPage,
            };
            const url = `/api/data/recent?${JSON.stringify(query)}`;
            return accessTokenClient(url).then(({ json }) => {
                return {
                    data: json.data.records,
                    total: json.data.total,
                };
            });
        }
        if (resource === 'subscribe') {
            const { page, perPage } = params.pagination;
            const filters = params.filter;
            const query = {
                ...filters,
                pageNo: page,
                pageSize: perPage,
            };
            const url = `/api/subscribe?${JSON.stringify(query)}`;
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
        if (resource === 'voiceList') {
            return accessTokenClient('/api/direct/voice/list/search').then(
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
        if (resource === 'subscribe') {
            return accessTokenClient(
                '/api/subscribe/detail?id=' + params.id
            ).then(({ json }) => {
                return {
                    data: json.data,
                };
            });
        }
        if (resource === 'addToMy') {
            return withLifeCycleCallbackProvider.update('uploadDetail', params);
        }
        return withLifeCycleCallbackProvider.getOne(resource, params);
    },
    create: (resource, params): any => {
        if (resource === 'recentsList') {
            return accessTokenClient('/api/download/addQueue', {
                method: 'POST',
                body: JSON.stringify(params.data),
            }).then(({ json }) => {
                return {
                    data: { data: json, id: 1 },
                };
            });
        }
        if (resource === 'test') {
            return new Promise(() =>
                setTimeout(() => {
                    return Promise.resolve();
                }, 40000)
            );
        }
        if (resource === 'loginPassword') {
            return accessTokenClient(
                `/api/direct/login/cellphone?${JSON.stringify(params.data)}`,
                {}
            ).then(({ json }) => {
                return {
                    data: { data: json, id: 1 },
                };
            });
        }
        if (resource === 'addToMy') {
            return accessTokenClient('/api/download/addToMyList', {
                method: 'POST',
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
    register: (resource, params) => {
        const { username, password } = params;
        return accessTokenClient('/api/register', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        }).then(({ json }) => {
            return {
                data: json,
            };
        });
    },
    qrCheck: key => {
        return accessTokenClient(
            `/api/direct/login/qr/check?key=${key}&timestamp=${Date.now()}`
        ).then(({ json }) => {
            return {
                data: json,
            };
        });
    },
    loginStatus: () => {
        return accessTokenClient(
            `/api/direct/login/status?timestamp=${Date.now()}`,
            {}
        ).then(({ json }) => {
            return {
                data: json,
            };
        });
    },
    isLogin: () => {
        return accessTokenClient(`/api/netmusic/loginStatus`, {}).then(
            ({ json }) => {
                return {
                    data: json,
                };
            }
        );
    },
    getQrCode: () => {
        return accessTokenClient('/api/netmusic/getQrCode', {}).then(
            ({ json }) => {
                return {
                    data: json.data,
                };
            }
        );
    },
    getVideoInfo: (resource, params) => {
        return accessTokenClient(
            `/api/download/getVideoInfo?bvid=${params.bvid}${
                params.cid ? '&cid=' + params.cid : ''
            }`
        ).then(({ json }) => {
            return {
                data: json.data,
            };
        });
    },
    getSeriesInfo: (resource, params) => {
        return accessTokenClient(
            '/api/download/getSeriesInfo?id=' + params.id
        ).then(({ json }) => {
            return {
                data: json.data,
            };
        });
    },
    getSeriesIdByUrl: (resource, params) => {
        return accessTokenClient(
            '/api/download/getSeriesIdByBvid?url=' + params.url
        ).then(({ json }) => {
            return {
                data: json.data,
            };
        });
    },
    getUserInfo: (resource, params) => {
        return accessTokenClient(
            '/api/download/getUserInfo?uid=' + params.uid
        ).then(({ json }) => {
            return {
                data: json.data,
            };
        });
    },
    getUserFavoriteList: (resource, params) => {
        return accessTokenClient(
            '/api/download/getFavoriteList?uid=' + params.uid
        ).then(({ json }) => {
            return {
                data: json.data,
            };
        });
    },
    sendCode: (resource, params) => {
        console.log(params);
        return accessTokenClient(
            `/api/direct/captcha/send?${JSON.stringify(params)}`
        ).then(({ json }) => {
            return {
                data: json,
            };
        });
    },
    verify: (resource, params) => {
        return accessTokenClient(
            `/api/direct/captcha/verify?${JSON.stringify(params)}`
        ).then(({ json }) => {
            return {
                data: json,
            };
        });
    },
    checkHasUploaded: (resource, params) => {
        return accessTokenClient(`/api/uploadDetail/checkHasUploaded`).then(
            ({ json }) => {
                return {
                    data: json.data,
                };
            }
        );
    },
};

const addTagsSearchSupport = (dataProvider: DataProvider) => ({
    ...dataProvider,
    getList: (resource, params) => {
        if (resource === 'comments') {
            // partial pagination
            return dataProvider
                .getList(resource, params)
                .then(({ data, total }) => ({
                    data,
                    pageInfo: {
                        hasNextPage:
                            params.pagination.perPage * params.pagination.page <
                            total,
                        hasPreviousPage: params.pagination.page > 1,
                    },
                }));
        }
        if (resource === 'tags') {
            const matchSearchFilter = Object.keys(params.filter).find(key =>
                key.endsWith('_q')
            );
            if (matchSearchFilter) {
                const searchRegExp = new RegExp(
                    params.filter[matchSearchFilter],
                    'i'
                );

                return dataProvider.getList(resource, {
                    ...params,
                    filter: item => {
                        const matchPublished =
                            item.published == params.filter.published; // eslint-disable-line eqeqeq

                        const fieldName = matchSearchFilter.replace(
                            /(_q)$/,
                            ''
                        );
                        return (
                            matchPublished &&
                            get(item, fieldName).match(searchRegExp) !== null
                        );
                    },
                });
            }
        }

        return dataProvider.getList(resource, params);
    },
});

const uploadCapableDataProvider = addUploadFeature(
    addTagsSearchSupport(dataProvider)
);

const sometimesFailsDataProvider = new Proxy(uploadCapableDataProvider, {
    get: (target, name) => (resource, params) => {
        if (typeof name === 'symbol' || name === 'then') {
            return;
        }
        // set session_ended=true in localStorage to trigger an API auth error
        if (localStorage.getItem('session_ended')) {
            const error = new Error('Session ended') as ResponseError;
            error.status = 403;
            return Promise.reject(error);
        }
        // add rejection by type or resource here for tests, e.g.
        // if (name === 'delete' && resource === 'posts') {
        //     return Promise.reject(new Error('deletion error'));
        // }
        if (
            resource === 'posts' &&
            params.data &&
            params.data.title === 'f00bar'
        ) {
            return Promise.reject(
                new HttpError('The form is invalid', 400, {
                    errors: {
                        title: 'this title cannot be used',
                    },
                })
            );
        }
        return uploadCapableDataProvider[name](resource, params);
    },
});

const delayedDataProvider = new Proxy(sometimesFailsDataProvider, {
    get: (target, name) => (resource, params) => {
        if (typeof name === 'symbol' || name === 'then') {
            return;
        }
        return new Promise(resolve =>
            setTimeout(
                () =>
                    resolve(sometimesFailsDataProvider[name](resource, params)),
                300
            )
        );
    },
});

interface ResponseError extends Error {
    status?: number;
}

export function parseImgUrl(url: string): string {
    return url.replace(/^(http)s*(:\/\/)/, 'https://images.weserv.nl/?url=');
}

export function parseDatetime(date: Date): string {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export default dataProvider;
