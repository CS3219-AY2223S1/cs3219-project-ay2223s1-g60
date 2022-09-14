const URI_USER_SVC = process.env.URI_USER_SVC || "http://localhost:8000";

const PREFIX_USER_SVC = "/api/user";

const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;

const USER_SIGNUP = "/signup";
const USER_LOGIN = "/login";
const USER_LOGOUT = "/logout";
const USER_CHANGE_PASSWORD = "/change-password";
const USER_CHANGE_USERNAME = "/change-username";
const USER_DELETE_USER = "/delete-user";
const USER_LOGIN_WITH_TOKEN = "/loginWithToken";

export const URL_USER_SIGNUP = URL_USER_SVC + USER_SIGNUP;
export const URL_USER_LOGIN = URL_USER_SVC + USER_LOGIN;
export const URL_USER_LOGOUT = URL_USER_SVC + USER_LOGOUT;
export const URL_USER_CHANGE_PASSWORD = URL_USER_SVC + USER_CHANGE_PASSWORD;
export const URL_USER_CHANGE_USERNAME = URL_USER_SVC + USER_CHANGE_USERNAME;
export const URL_USER_LOGIN_WITH_TOKEN = URL_USER_SVC + USER_LOGIN_WITH_TOKEN;
export const URL_USER_DELETE_USER = URL_USER_SVC + USER_DELETE_USER;

export const LOCAL_STORAGE_TOKEN_KEY = "token";
export const LOCAL_STORAGE_USERNAME_KEY = "username";
