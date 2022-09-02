import { createUser, deleteToken, getToken } from './repository.js';
import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({username, password});
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormDeleteToken(username, token) {
    try {
        return await deleteToken(username, token);
    } catch (err) {
        return { err };
    }
}

export async function ormGetToken(username, token) {
    try {
        const dbToken = await getToken(username);
        return dbToken;
    } catch (err) {
        return { err };
    }
}