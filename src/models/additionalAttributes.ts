import mongoose, { model, Schema } from "mongoose";

const additionalFields = new Schema({

  fieldName: {
    type: String,
    required: true,
  },
  keyvalue: {
    type: String,
    require: true,

  },
},);

const additionalAttributesField = model("AdditionalFields", additionalFields);

export { additionalAttributesField };
