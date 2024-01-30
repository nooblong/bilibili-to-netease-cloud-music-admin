export default async function request(
    method: string,
    url: string,
    body: any,
    process: boolean
): Promise<any> {
    method = method.toUpperCase();
    if (method === 'GET') {
        body = null;
    } else {
        body = Boolean(body) && JSON.stringify(body);
    }

    return await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Token': sessionStorage.getItem('token') ?? '', // 从sessionStorage中获取access token
        },
        // mode: "cors",
        body,
    }).then(async res => {
        if (process) {
            // if (res.status === 401 || res.status === 500) {
            // redirect("/login");
            // return Promise.reject("Unauthorized");
            // } else {
            const token = res.headers.get('Access-Token');
            if (token != null) {
                sessionStorage.setItem('token', token);
            }
            return await res.json().then(value => {
                if (value.code === 401) {
                    console.log('需要登录小工具账号');
                    // window.location.href = '/login'
                    // window.location.reload();
                    // return Promise.reject("Unauthorized")
                }
                return value;
            });
            // }
        } else {
            return res;
        }
    });
}

// GET 请求
export async function get(url: string): Promise<any> {
    return await request('GET', url, null, true);
}

// POST 请求
export async function post(url: string, body: any): Promise<any> {
    return await request('POST', url, body, true);
}

export async function simplePost(url: string, body: any): Promise<any> {
    return await request('POST', url, body, false);
}
