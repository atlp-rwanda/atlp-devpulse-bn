import TraineeApplicant from '../models/traineeApplicant'

const traineeResolvers:any={
  Query: {
    async getAllTrainees(parent:any, args:any){
    
      
        const gettrainee = await TraineeApplicant.find({delete_at: false});
        

        return gettrainee;
      
     
      },

      async  getAllSoftDeletedTrainees (parent:any, args:any ){
        const getAllTrainee= await TraineeApplicant.find({delete_at: true})
        if(!getAllTrainee) throw new Error("no Trainee Available");
        
        return getAllTrainee
      },
     async traineeSchema(parent:any, args:any){
      const getOnetrainee = await TraineeApplicant.findById(args.id)
      if(!getOnetrainee) throw new Error ("trainee doesn't exist");
      return getOnetrainee;
      
      
      
     },
    },
    Mutation: {
          async deleteTrainee(parent:any, args:any, context:any){
            const deleteTrainee= await TraineeApplicant.findById(args.id)
            if(!deleteTrainee) throw new Error(" Trainee doesn't exist")
            const deletedTrainee = await TraineeApplicant.findByIdAndRemove(args.id);

            
            return deletedTrainee;
          },
          async softdeleteTrainee(parent:any,args:any){
            const trainee = await TraineeApplicant.findById(args.input.id);
            if(!trainee) throw new Error("Trainee doesn't exist")
            const softDelete= await TraineeApplicant.findByIdAndUpdate(args.input.id,{ $set: {delete_at:  true, id:args.input.id}},{ new: true });     
            return softDelete;
          },
          async softRecover(parent:any,args:any){
            const trainee = await TraineeApplicant.findById(args.input.id);
            if(!trainee) throw new Error("Trainee doesn't exist")
            const softRecovered= await TraineeApplicant.findByIdAndUpdate(args.input.id,{ $set: {delete_at:  false, id:args.input.id}},{ new: true });
            return softRecovered;
          },
        }

}
export default traineeResolvers;