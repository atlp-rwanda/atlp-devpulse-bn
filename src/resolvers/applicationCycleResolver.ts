import {applicationCycle} from '../models/applicationCycle'

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
                const deleteapplicationCycle= await applicationCycle.findById(_args.id);
                if(!deleteapplicationCycle) throw new Error("This applicationCycle doesn't exist")
                const deletedapplicationCycle = await applicationCycle.findByIdAndRemove(_args.id);
                return deletedapplicationCycle;
              },
              async updateApplicationCycle(_parent:any,_args:any){
                const newapplicationCycle= await applicationCycle.findByIdAndUpdate(_args.id, {name:_args.input.name, startDate:_args.input.startDate,endDate:_args.input.endDate },{new:true});
                return newapplicationCycle;
              },
            }
   
}
export default applicationCycleResolver