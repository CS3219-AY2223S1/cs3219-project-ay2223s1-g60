const URI_USER_SVC = process.env.URI_USER_SVC || "http://localhost:8000";

const PREFIX_USER_SVC = "/api/user";
const SIGNUP = "/signup";
const LOGIN = "/login";

const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;

const USER_SIGNUP = "/signup";
const USER_LOGIN = "/login";
const USER_LOGOUT = "/logout";
const USER_LOGIN_WITH_TOKEN = "/loginWithToken";

export const URL_USER_SIGNUP = URL_USER_SVC + USER_SIGNUP;
export const URL_USER_LOGIN = URL_USER_SVC + USER_LOGIN;
export const URL_USER_LOGOUT = URL_USER_SVC + USER_LOGOUT;
export const URL_USER_LOGIN_WITH_TOKEN = URL_USER_SVC + USER_LOGIN_WITH_TOKEN;
