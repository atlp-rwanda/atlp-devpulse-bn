import mongoose, { model, Schema } from "mongoose";
const TraineeApplicant = mongoose.model(
  "Trainee",
  new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    email: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    delete_at: {
      type: Boolean,
      default: false,
    },
    cycle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicationCycle",
      required: true,
    },
    applicationPhase: {
      type: String,
      enum: ["Applied", 'Shortlisted', 'Technical Assessment', 'Interview Assessment', 'Admitted', 'Dismissed', "Enrolled"],
      default: "Applied",
    },
    status: {
      type: String,
      default: "Not Assigned",
    },
    cohort: {
      type: Schema.Types.ObjectId,
      ref: "cohortModel",
    }
  }, {
    timestamps: true
  })
);

export default TraineeApplicant;
