import { 
    ormCreateUser as _createUser, 
    ormDeleteToken as _logout, 
    ormGetToken as _getToken 
} from '../model/user-orm.js'
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function loginWithToken(req, res) {
    try {
        const { username } = req.body;
        const token = req.headers.authorization.split(" ")[1];

        if (username && token) {
            const resp = await _getToken(username, token);

            if (resp.err) {
                
            } else {
                jwt.verify(resp, process.env.PRIVATE_KEY, function(err, decodedFromDb) {
                    try {
                        jwt.verify(token, process.env.PRIVATE_KEY, function(err, decodedFromUser) {
                            
                            if (decodedFromDb.username === decodedFromUser.username && decodedFromDb.hashedPassword === decodedFromUser.hashedPassword && decodedFromDb._id === decodedFromUser._id) {
                                return res.status(201).json({message: `Successfully log ${username} in with token!`});

                            } else {
                                return res.status(400).json({message: 'Your token is invalid'});

                            }
                            console.log(decoded) // bar
                        });
                    } catch (err) {
                        return res.status(400).json({message: 'Your token is invalid'});
                    }// bar
                });
            }
        } else {
            return res.status(400).json({message: 'Username and/or token are missing!'});
        }
    } catch(err) {

    }
}

export async function logout(req, res) {
    try {
        const { username, token } = req.body;
        if (username && token) {
            const resp = await _logout(username, token);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: `Could not logout ${username}!`});
            } else {
                return res.status(201).json({message: `Log ${username} out successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or token are missing!'});
        }
    } catch(err) {

    }
}
