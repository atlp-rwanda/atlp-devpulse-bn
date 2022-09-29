import mongoose, { model,Schema } from "mongoose";

const traineeAttributeSchema = new Schema({
    gender: {
        type: String,
        required: true,
    },
    birth_date: {
        type: Date,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    phone:{
        type:String,
        required:true
    },
    field_of_study:{
        type:String,
        required:true
    },
    education_level:{
        type:String,
        required:true
    },
    province:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    sector:{
        type:String,
        required:true
    },
    cohort:{
        type:String,
        required:true
    },
    isEmployeed:{
        type:Boolean,
        required:true
    },
    haveLaptop:{
        type:Boolean,
        required:true
    },
    isStudent:{
        type:Boolean,
        required:true
    },
    Hackerrank_score:{
        type:String,
        required:true,
        default:"-"
    },
    english_score:{
        type:String,
        required:true,
        default:"-"
    },
    interview_decision:{
        type:String,
        required:true,
        default:"-"
    },
    past_andela_programs:{
        type:String,
        required:true,
    },
    trainee_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainee",
        required: true,
    }
})

const traineEAttributes = model("Attributes",traineeAttributeSchema);

export {traineEAttributes}

