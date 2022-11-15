import mongoose, { model, Schema } from "mongoose";
const scoreValuesModel = mongoose.model(
  "Value",
  new Schema({
    score_value: {
      type: String,
      required: true,
    },
    attr_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Attributes",
    },
    score_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Scores",
    },
  })
);

export default scoreValuesModel;
