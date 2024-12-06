import TraineeApplicant from '../models/traineeApplicant';
import { applicationCycle } from '../models/applicationCycle';
import { traineEAttributes } from "../models/traineeAttribute";


const seedDeleteTrainee = async () => {
    const cycle = await applicationCycle.findOne();

    if (!cycle) {
        return;
    }

    await TraineeApplicant.deleteMany({});
    await traineEAttributes.deleteMany({});
    return null;
}
export default seedDeleteTrainee;