# CS3219-AY22-23-Project

This is `Group 60`'s CS3219 project.

Group Members:

- [Christian Drake Martin](https://github.com/drake25122000)
- [Erin May Gunawan](https://github.com/erinmayg)
- [Florencia Martina](https://github.com/florenciamartina)
- [Woo Jian Zhe](https://github.com/jzwoo)

## Tech Stack

|                    | Technology                                           |
| ------------------ | ---------------------------------------------------- |
| Frontend           | ReactTS                                              |
| Backend            | Node.js, Express.js, JWT, Redis, Selenium, Socket.io |
| Database           | MongoDB                                              |
| Project Management | GitHub Issues                                        |

## Project Setup

### Tech Stack

#### Node.js

Ensure you have `Node.js` installed in your PC. You can check by running `node -v`, it should return the version of Node you have.

If you don't have node installed on your machine, refer to their [installation guide](https://nodejs.org/en/download/) for details.

Our project is compatible with Node versions: `14.x`, `16.x`, `18.x`

#### MongoDB Atlas

This project requires a MongoDB Atlas account. ([Sign up](https://www.mongodb.com/cloud/atlas/register) / [sign in](https://account.mongodb.com/account/login?nds=true)).

#### Redis

Ensure you have redis installed on your host-machine, for installation details, refer to their [installation guide](https://redis.io/docs/getting-started/installation/).

### Set up .env

Refer to each service's `README.md` to set up their `.env`

- [User Service](./user-service/README.md)
- [Matching Service](./matching-service/README.md)
- [Communication Service](./communication-service/README.md)
- [Collaboration Service](./collaboration-service/README.md)
- [History Service](./history-service/README.md)
- [Question Service](./question-service/README.md)

### Running Env

To run this project, ensure that `.env` files are available in each `*-service`, and run the following commands from the project root:

```bash
# Install dependencies
npm i
npm run install-dep

# Run the project
npm run dev
```

## Documentation

- [Developer Documentation](60-ProjectReport.pdf)
