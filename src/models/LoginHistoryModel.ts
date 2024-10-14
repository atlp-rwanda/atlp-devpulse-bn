import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoggedUserModel',
    required: true,
  },
  email: {
    type: String,
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
  browser: {
    type: String,
    required: true,
  },
});

export const LoginHistoryModel = mongoose.model('LoginHistory', loginHistorySchema);
