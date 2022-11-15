import mongoose, { model, Schema } from "mongoose";
const scoreTypesModel = mongoose.model(
  "Scores",
  new Schema({
    score_type: {
      type: String,
      required: true,
    },
  })
);

export default scoreTypesModel;
