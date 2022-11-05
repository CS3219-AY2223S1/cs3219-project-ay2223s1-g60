import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let RoomModelSchema = new Schema({
  user1: {
    type: { user_id: { type: String }, username: { type: String } },
    required: true,
    unique: true,
  },
  user2: {
    type: { user_id: { type: String }, username: { type: String } },
    default: null,
    unique: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  question: {
    type: Object,
    default: null,
  },
});

export default mongoose.model('RoomModel', RoomModelSchema);
