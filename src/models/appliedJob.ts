import mongoose from 'mongoose';

const AppliedJobSchema = new mongoose.Schema({
  data: {
    type: Map,  // This allows storing key-value pairs dynamically
    of: mongoose.Schema.Types.Mixed,  // Mixed type for any kind of data
  },
});

export const AppliedJobModel = mongoose.model('AppliedJob', AppliedJobSchema);