const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000';

const PREFIX_USER_SVC = '/api/user';

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;

export const USER_SIGNUP = '/signup';
export const USER_LOGIN = '/login';
export const USER_LOGOUT = '/logout';
export const USER_CHANGE_PASSWORD = '/change-password';
export const USER_CHANGE_USERNAME = '/change-username';
export const USER_DELETE_USER = '/delete-user';
export const USER_LOGIN_WITH_TOKEN = '/loginWithToken';

export const URL_USER_SIGNUP = URL_USER_SVC + USER_SIGNUP;
export const URL_USER_LOGIN = URL_USER_SVC + USER_LOGIN;
export const URL_USER_LOGOUT = URL_USER_SVC + USER_LOGOUT;
export const URL_USER_CHANGE_PASSWORD = URL_USER_SVC + USER_CHANGE_PASSWORD;
export const URL_USER_CHANGE_USERNAME = URL_USER_SVC + USER_CHANGE_USERNAME;
export const URL_USER_LOGIN_WITH_TOKEN = URL_USER_SVC + USER_LOGIN_WITH_TOKEN;
export const URL_USER_DELETE_USER = URL_USER_SVC + USER_DELETE_USER;

export const LOCAL_STORAGE_TOKEN_KEY = 'token';
export const LOCAL_STORAGE_TOKEN_ROOM_KEY = 'token-room';
export const LOCAL_STORAGE_USERNAME_KEY = 'username';

const URI_MATCHING_SVC =
  process.env.URI_MATCHING_SVC || 'http://localhost:8001';
const PREFIX_MATCHING_SVC = '';
export const URL_MATCHING_SVC = URI_MATCHING_SVC + PREFIX_MATCHING_SVC;

const PREFIX_ROOM_SVC = '/api/room';
export const URI_ROOM_SVC = URI_MATCHING_SVC + PREFIX_ROOM_SVC;

const URI_COMMUNICATION_SVC =
  process.env.URI_COMMUNICATION_SVC || 'http://localhost:8002';
const PREFIX_COMMUNICATION_SVC = '';
export const URL_COMMUNICATION_SVC =
  URI_COMMUNICATION_SVC + PREFIX_COMMUNICATION_SVC;

const URI_COLLABORATION_SVC =
  process.env.URI_COLLABORATION_SVC || 'http://localhost:8003';
const PREFIX_COLLABORATION_SVC = '';
export const URL_COLLABORATION_SVC =
  URI_COLLABORATION_SVC + PREFIX_COLLABORATION_SVC;

const URI_QUESTION_SVC =
  process.env.URI_QUESTION_SVC || 'http://localhost:8004';
const PREFIX_QUESTION_SVC = '/api/question';
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC;

const URI_HISTORY_SVC =
  process.env.URI_HISTORY_SVC || 'http://localhost:8005';
const PREFIX_HISTORY_SVC = '/api/history';
export const URL_HISTORY_SVC = URI_HISTORY_SVC + PREFIX_HISTORY_SVC;

export const ALL_USER_HISTORY = "/historyList/";
