import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoggedUserModel',
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  ipAddress: {
    type: String,
  },
});

export const LoginHistoryModel = mongoose.model('LoginHistory', loginHistorySchema);
