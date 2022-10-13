import QuestionModel from "./question-model.js";
import QuestionTypeModel from "./question-type-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Successfully connected to MongoDB"));

export async function getRandomQuestion(params) {
  // Get all questions that is associated to question_type and difficulty
  console.log("Difficulty: " + params.question_difficulty);
  console.log("Type: " + params.question_type);

  var questions_to_randomize;
  if (params.question_type) {
    questions_to_randomize = await QuestionTypeModel.find({
      question_type: params.question_type,
      question_difficulty: params.question_difficulty,
    });
  } else {
    questions_to_randomize = await QuestionTypeModel.find({
      question_difficulty: params.question_difficulty,
    });
  }

  // Randomize id
  let index = Math.floor(Math.random() * questions_to_randomize.length);
  let id = questions_to_randomize[index].question_frontend_id;

  const question = await QuestionModel.findOne({
    question_frontend_id: id,
  });
  console.log(`Question id : ${id}`);

  if (question) {
    console.log(question);
    return question;
  }
}
