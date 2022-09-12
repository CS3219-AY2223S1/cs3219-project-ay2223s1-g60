import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let MatchModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  requestId: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  matchedUser: {
    type: String,
    default: null,
  },
  sessionInfo: {
    type: Object,
    default: null,
  },
});

export default mongoose.model('MatchModel', MatchModel);
