import mongoose, { model, Schema } from "mongoose";
const TraineeApplicant = mongoose.model(
  "Trainee",
  new Schema({
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
    status: {
      type: String,
      default: "Not Assigned",
    },
  })
);

export default TraineeApplicant;
