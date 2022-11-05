import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let HistoryModelSchema = new Schema({
  user1: {
    type: { user_id: { type: String }, username: { type: String } },
    required: true,
  },
  user2: {
    type: { user_id: { type: String }, username: { type: String } },
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  chats: {
    type: [{ type: Object }],
    required: true,
  },
  question: {
    type: Object,
    required: true,
  },
  code: {
    type: Object,
    required: true,
  },
});

export default mongoose.model('HistoryModel', HistoryModelSchema);
