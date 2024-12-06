import mongoose from 'mongoose'

const jobApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'LoggedUserModel'
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'jobform'
    },
    essay:{
        type: String,
        required: true
    },
    resume:{
        type:String,
        required: true
    },
    status:{
        type:String,
        enum:['under-review','accepted','rejected'],
        default:'under-review'
    },
    comment: {
        type:String,
        required: false
    }
},{timestamps:true})

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema)

export default JobApplication