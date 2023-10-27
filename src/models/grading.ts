import mongoose, { model, Schema } from "mongoose";
const Scale = ["Linear Scale", "Percentages", "Letter Grades", "Pass/Fail"]
const gradingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assessment: [],
  grades: [
    {
      scale: {
        name: {
          type: String,
          enum: Scale,
          required: true,
        },
        lowerValue: {
          value: {
            type: Schema.Types.Mixed,
          },
          desc: {
            type: Schema.Types.Mixed,
          },
        },
        upperValue: {
          value: {
            type: String,
          },
          desc: {
            type: String,
          },
        },
      },
      attribute: {
          type: String,
        },
    },
  ],
});

export const gradingModel = model("grading", gradingSchema);
