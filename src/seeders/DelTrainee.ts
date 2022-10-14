import  TraineeApplicant from '../models/traineeApplicant';


const seedDeleteTrainee = async () => {

    const deleteTrainee = [
        {
            email: 'beniraa@gmail.com',
            firstname: 'Ben',
            lastname: 'iraa',
            deleted_at: false
            
        },
        {
            email: 'ben@gmail.com',
            firstname: 'iradukunda',
            lastname: 'benjamin',
            deleted_at: false

        },
        {
            email: 'carlos@gmail.com',
            firstname: 'carlos',
            lastname: 'Bz',
            deleted_at: false

        },
        {
            email: 'nshuti@gmail.com',
            firstname: 'blaise',
            lastname: 'k',
            deleted_at: false

        },
    ];
    await TraineeApplicant.deleteMany({});
    await TraineeApplicant.insertMany(deleteTrainee);
    return null;
}
export default seedDeleteTrainee;