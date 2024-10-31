import { PerformanceModel } from "../models/performanceModel";
import TraineeApplicant from "../models/traineeApplicant";

const seedPerformance = async () => {
    const trainee = await TraineeApplicant.findOne();


    if(!trainee){
        return;
    }

    const performance = {
        trainee_id: trainee._id,
        cycle_id: trainee.cycle_id,
        score: 85,
        date: new Date('2024-05-10'),
        feedback: "Great performance",
    }

    await PerformanceModel.deleteMany({performance});
    await PerformanceModel.insertMany(performance);

}

export default seedPerformance;