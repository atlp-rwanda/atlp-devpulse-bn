import {applicationCycle} from '../models/applicationCycle.js'
import { traineEAttributes} from '../models/traineeAttribute.js'
import TraineeApplicant from '../models/traineeApplicant.js'

const applicationCycleResolver:any={
    Query: {
        async getAllApplicationCycles(){
            const getcohortCycles = await applicationCycle.find({});
            return getcohortCycles;
          },
         async applicationCycle(parent:any, args:any){
          const getOneapplicationCycle = await applicationCycle.findById(args.id)
          if(!applicationCycle) throw new Error("This cohort cycle doesn't exist");
          return getOneapplicationCycle;
           
         },
        },
         Mutation: {
            async createApplicationCycle(_parent:any,_args:any) {
                const applicationCycleExists = await applicationCycle.findOne({ name: _args.name });
                if (applicationCycleExists) throw new Error("applicationCycle already exists");
                const newapplicationCycle= await applicationCycle.create({name:_args.input.name,startDate:_args.input.startDate,endDate:_args.input.endDate, });
                return newapplicationCycle;
              },
              async deleteApplicationCycle(_parent:any, _args:any){
                      const applicationCycleToDelete= await applicationCycle.findById(_args.id);
                      if(applicationCycleToDelete !=null){
                          const user = await  TraineeApplicant.findOne({cycle_id:_args.id})
                          if (user) {
                                throw new Error(`cycle has some applicants`) 
                          }else{
                            const applicationCycleDeleted = await applicationCycle.findByIdAndRemove(_args.id);
                                return applicationCycleDeleted
                            }
                      }else{
                             throw new Error("This applicationCycle doesn't exist")
                      }
              },
              async updateApplicationCycle(_parent:any,_args:any){
                const newapplicationCycle= await applicationCycle.findByIdAndUpdate(_args.id, {name:_args.input.name, startDate:_args.input.startDate,endDate:_args.input.endDate },{new:true});
                return newapplicationCycle;
              },
            }
   
}
export default applicationCycleResolver