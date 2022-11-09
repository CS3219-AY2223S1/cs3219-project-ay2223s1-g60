# Setting up .env

Duplicate the `.env.sample` file and rename it to `.env`, fill in the missing values.

```text
ENV=<PROD | TEST>
ORIGIN=<frontend url>
PORT=<port no.>
```

Note: `ORIGIN` and `PORT` have default values `http://localhost:3000` and `8003` respectively

# Run Independently

To run `collaboration-service` independently (i.e. without other services running), run the following commands:

Navigate to the `./collaboration-service` directory

```bash
# Install dependencies
npm i

# Run collaboration-service
npm run dev

# Run test
# Ensure ENV=TEST first
npm run test
```
