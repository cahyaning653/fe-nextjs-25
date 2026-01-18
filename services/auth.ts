import callAPI from '@/config/api';

const ROOT_API = process.env.NEXT_PUBLIC_API;
const API_VERSION = 'api/v1';

export async function setLogin(data: any) {
    const url = `${ROOT_API}/${API_VERSION}/auth/login`;

    return callAPI({
        url,
        method: 'POST',
        data,
    });
}

export async function setRegister(data: any) {
    const url = `${ROOT_API}/${API_VERSION}/auth/register`;

    return callAPI({
        url,
        method: 'POST',
        data,
    });
}

export async function setLogout() {
    const url = `${ROOT_API}/${API_VERSION}/auth/logout`;

    return callAPI({
        url,
        method: 'POST',
        token: true,
    });
}

export async function getUser() {
    const url = `${ROOT_API}/${API_VERSION}/auth/user`;

    return callAPI({
        url,
        method: 'GET',
        token: true,
    })
}