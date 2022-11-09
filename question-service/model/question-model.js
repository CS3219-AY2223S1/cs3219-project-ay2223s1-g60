import mongoose from "mongoose";

var Schema = mongoose.Schema;
let QuestionModelSchema = new Schema({
  question_frontend_id: {
    type: Number,
    required: true,
    unique: true,
  },
  question_title: {
    type: String,
    required: true,
  },
  question_title_slug: {
    type: String,
    required: true,
  },
  question_text: {
    type: String,
    required: true,
  },
  question_difficulty: {
    type: Number,
    required: true,
  },
  discussion_urls: {
    type: [{ type: String }],
    required: false,
  },
});

export default mongoose.model("QuestionModel", QuestionModelSchema);
