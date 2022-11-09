import mongoose from "mongoose";

var Schema = mongoose.Schema;
let QuestionTypeModelSchema = new Schema(
  {
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
  },
  { collection: "question_type_model" }
);

export default mongoose.model("QuestionTypeModel", QuestionTypeModelSchema);
