import mongoose from "mongoose";
var Schema = mongoose.Schema;
let UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

export default mongoose.model("UserModel", UserModelSchema);
