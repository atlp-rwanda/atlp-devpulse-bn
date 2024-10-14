import  TraineeApplicant from '../models/traineeApplicant';
import  applicationCycle  from '../models/applicationCycle';


const seedDeleteTrainee = async () => {
    const cycle = await applicationCycle.findOne();
    
    if (!cycle) {
      return;
    }

    const deleteTrainee = [
        {
            email: 'beniraa@gmail.com',
            firstName: 'Ben',
            lastName: 'iraa',
            deleted_at: false,
            cycle_id: cycle._id
            
        },
        {
            email: 'ben@gmail.com',
            firstName: 'iradukunda',
            lastName: 'benjamin',
            deleted_at: false,
            cycle_id: cycle._id

        },
        {
            email: 'carlos@gmail.com',
            firstName: 'carlos',
            lastName: 'Bz',
            deleted_at: false,
            cycle_id: cycle._id

        },
        {
            email: 'nshuti@gmail.com',
            firstName: 'blaise',
            lastName: 'k',
            deleted_at: false,
            cycle_id: cycle._id

        },
    ];
    await TraineeApplicant.deleteMany({deleteTrainee});
    await TraineeApplicant.insertMany(deleteTrainee);
    return null;
}
export default seedDeleteTrainee;