# Setting up .env

Duplicate the `.env.sample` file and rename it to `.env`, fill in the missing values.

```text
ENV=<PROD | TEST>
DB_CLOUD_URI=<MongoDB Atlas URL>
DB_CLOUD_URI_TEST=<MongoDB Atlas URL>
JWT_ROOM_PRIVATE_KEY=<String>
```

Note: `DB_CLOUD_URI` is used for `ENV=PROD` and `DB_CLOUD_URI_TEST` is used for `ENV=TEST`

# Run Independently

To run `matching-service` independently (i.e. without other services running), run the following commands:

Navigate to the `./matching-service` directory

```bash
# Install dependencies
npm i

# Run matching-service
npm run dev

# Run test
# Ensure ENV=TEST first
npm run test
```
