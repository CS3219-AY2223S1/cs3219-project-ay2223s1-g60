# Setting up .env

Duplicate the `.env.sample` file and rename it to `.env`, fill in the missing values.

```text
ENV=<PROD | TEST>
DB_CLOUD_URI=<MongoDB Atlas URL>
DB_CLOUD_URI_TEST=<MongoDB Atlas URL>
SALT_ROUNDS=<Integer>
JWT_PRIVATE_KEY=<String>
```

Note: `DB_CLOUD_URI` is used for `ENV=PROD` and `DB_CLOUD_URI_TEST` is used for `ENV=TEST`

# Run Independently

To run `history-service` independently (i.e. without other services running), run the following commands:

Navigate to the `./history-service` directory

```bash
# Install dependencies
npm i

# Run history-service
npm run dev

# Run test
# Ensure ENV=TEST first
npm run test
```
