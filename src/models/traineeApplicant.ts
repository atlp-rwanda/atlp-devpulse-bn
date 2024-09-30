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
      required: true,
      unique: true,
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
      enum: ["Applied", "Interviewed", "Accepted", "Enrolled"],
      default: "Applied",
    },
    status: {
      type: String,
      default: "Not Assigned",
    },
  })
);

export default TraineeApplicant;
