import mongoose from "mongoose";

var Schema = mongoose.Schema;
let QuestionTypeModelSchema = new Schema({
  question_type: {
    type: String,
    required: true,
  },
  question_frontend_id: {
    type: Number,
    required: true,
  },
  question_difficulty: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("QuestionTypeModel", QuestionTypeModelSchema);
