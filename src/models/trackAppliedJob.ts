import mongoose from "mongoose";

const TrackerAppliedJob = new mongoose.Schema({
    sheetDataId: { type: mongoose.Types.ObjectId, ref:"AppliedJob", required: true },
    sheetId:{ type: String, required: true },
    lastProcessedRow: { type: Number, required: true }
})

export const TrackSheet =  mongoose.model("TrackAppliedJob", TrackerAppliedJob);