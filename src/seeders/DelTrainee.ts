import  TraineeApplicant from '../models/traineeApplicant.js';


const seedDeleteTrainee = async () => {

    const deleteTrainee = [
        {
            email: 'beniraa@gmail.com',
            firstName: 'Ben',
            lastName: 'iraa',
            deleted_at: false
            
        },
        {
            email: 'ben@gmail.com',
            firstName: 'iradukunda',
            lastName: 'benjamin',
            deleted_at: false

        },
        {
            email: 'carlos@gmail.com',
            firstName: 'carlos',
            lastName: 'Bz',
            deleted_at: false

        },
        {
            email: 'nshuti@gmail.com',
            firstName: 'blaise',
            lastName: 'k',
            deleted_at: false

        },
    ];
    await TraineeApplicant.deleteMany({});
    await TraineeApplicant.insertMany(deleteTrainee);
    return null;
}
export default seedDeleteTrainee;