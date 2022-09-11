import { URL_USER_LOGIN, URL_USER_LOGOUT, URL_USER_LOGIN_WITH_TOKEN } from "../configs";

const LOCAL_STORAGE_TOKEN_KEY = "token";
const LOCAL_STORAGE_USERNAME_KEY = "username";

async function loginWithUsername(username:string, password:string):Promise<any> {

    const body = {
        username : username,
        password : password
    };

    const config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body) 
    }

    const resp =  await fetch(URL_USER_LOGIN, config);

    const data = await resp.json();

    if (resp.status != 201) {
        return resp;
    }
    
    window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
    window.localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, data.username);
    return resp;

}

async function loginWithToken():Promise<any> {
    const token = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    const username = window.localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
    let headers = { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`,
    };

    // if (token) {
    //     headers.Authorization = `${token}`;
    // }

    const body = {
        username : username,
    };

    return await fetch(URL_USER_LOGIN_WITH_TOKEN, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body) 
    });

}

export { loginWithUsername, loginWithToken };