import mongoose from 'mongoose';

const AppliedJobSchema = new mongoose.Schema({
  appliedJob: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  status:{
    type: String,
    default: 'submitted',
  }
});

export const AppliedJobModel = mongoose.model('AppliedJob', AppliedJobSchema);