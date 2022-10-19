import TraineeApplicant from "../models/traineeApplicant";

export  const recyclebinresolver:any ={
    Mutation:{
        async emptyRecyclebin(_:any){
            try {
             const resp= await TraineeApplicant.deleteMany({delete_at:true})
             if (resp.deletedCount==0) {
              return { __typename: 'NotFoundError',message: `recycle bin is empty`}
             }else{
              return  {__typename: 'traineeApplicant',...resp}
             }
                
            } catch (error:any) {
                if (error[0].message) {
                return { __typename: 'NotFoundError',message: `${error[0].message}`}}
            }
        }
    }
} 
