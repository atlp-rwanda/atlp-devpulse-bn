import mongoose, { Schema } from "mongoose";

const statusValues = ["due", "in-recruitment", "running", "done"];
const labelValues = ["private", "public"];
export const jobModels = mongoose.model(
  "jobform",
  new mongoose.Schema({
    title: {
      type: String,
    },
    program: {
      type: Schema.Types.ObjectId,
      ref: "ProgramModel",
      required: true,
    },
    cohort: {
      type: Schema.Types.ObjectId,
      ref: "cohortModel",
      required: true,
    },
    cycle: {
      type: Schema.Types.ObjectId,
      ref: "applicationCycle",
      required: true,
    },
    link: {
      type: String,
    },
    spreadsheetlink: {
      type: String,
    },
    formrange: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: statusValues,
      default: "due",
      required: true,
    },
    label: {
      type: String,
      enum: labelValues,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  })
);
