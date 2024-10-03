import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  message: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
