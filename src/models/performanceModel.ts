import mongoose, {Schema, model} from "mongoose";

const performanceSchema = new Schema({
    trainee: {
        type: Schema.Types.ObjectId,
        ref: "Trainee",
        required: true
    },

    assessment: {
        type: String
    },

    score: {
        type: Number,
        required: true,
    },

    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

export const PerformanceModel = model('Performance', performanceSchema);