import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let HistoryModelSchema = new Schema({
  username1: {
    type: String,
    required: true,
  },
  username2: {
    type: String,
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
