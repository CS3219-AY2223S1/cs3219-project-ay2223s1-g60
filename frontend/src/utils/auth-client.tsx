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

    return await fetch(URL_USER_LOGIN, config).then(async (resp) => {

        const data = await resp.json();
        window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
        window.localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, data.username);
        return data;
        // window.localStorage.setItem(LOCAL_STORAGE_KEY, "test");
    }).catch((err) => {
        console.log("The error : ", err);
    });

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