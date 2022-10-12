import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let RoomModelSchema = new Schema({
  user1: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  user2: {
    type: String,
    default: null,
    unique: true,
  },
  sessionInfo: {
    type: Object,
    default: null,
  },
});

export default mongoose.model('RoomModel', RoomModelSchema);
