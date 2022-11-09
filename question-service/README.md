# Setting up .env

Duplicate the `.env.sample` file and rename it to `.env`, fill in the missing values.

For question service : 

```text
ENV=PROD
DB_CLOUD_URI=<MongoDB Atlas URL>
```

For question service's scraper : 

```text
DB_CLOUD_URI=<MongoDB Atlas URL>
```

# Populating the Question DB

- Navigate to the scraper directory, from root directory run `cd question-service/scraper`
- To scrape questions from LeetCode and store them to the MongoDB, run `python main.py <NUMBER_OF_EASY_QUESTIONS> <NUMBER_OF_MEDIUM_QUESTIONS> <NUMBER_OF_HARD_QUESTIONS>`. The number of questions scraped will be defaulted to 200 if not provided.

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
