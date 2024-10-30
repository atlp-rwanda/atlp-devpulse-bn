import mongoose, { Schema } from "mongoose";

const CycleAppliedSchema = new Schema({
  cycle: {
    type: Schema.Types.ObjectId,
    ref: 'ApplicationCycle',
    required: true
  },
})

const TraineeApplicantSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    cycle_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicationCycle",
      required: true
    },
    delete_at: {
      type: Boolean,
      default: false,
    },
    cycleApplied: [CycleAppliedSchema],
    applicationPhase: {
      type: String,
      enum: ["Applied", 'Shortlisted', 'Technical Assessment', 'Interview Assessment', 'Admitted', 'Dismissed', "Enrolled"],
      default: "Applied",
    },
    status: {
      type: String,
      default: "No action",
    },
    cohort: {
      type: Schema.Types.ObjectId,
      ref: "cohortModel",
    }
  });

const TraineeApplicant = mongoose.model('Trainees', TraineeApplicantSchema);

  export default TraineeApplicant;
