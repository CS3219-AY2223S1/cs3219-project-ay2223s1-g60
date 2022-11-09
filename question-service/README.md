# Setting up .env

Duplicate the `.env.sample` file and rename it to `.env`, fill in the missing values.

```text
ENV=PROD
DB_CLOUD_URI=<MongoDB Atlas URL>
```

# Populating the Question DB

[TODO: Fill in the steps]

# Run Independently

To run `question-service` independently (i.e. without other services running), run the following commands:

Navigate to the `./question-service` directory

```bash
# Install dependencies
npm i

# Run question-service
npm run dev

# Run test
npm run test
```
