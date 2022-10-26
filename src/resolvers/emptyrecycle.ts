import TraineeApplicant from "../models/traineeApplicant";

export  const recyclebinresolver:any ={
    Query: {
        async allSoftDeletedTrainees(_: any, { input }: any) {
          // define page
          const { page, itemsPerPage, All } = input;
          let pages;
          let items;
    
          if (page) {
            pages = page;
          } else {
            pages = 1;
          }
          if (All) {
            // count total items inside the collections
            const totalItems = await TraineeApplicant.countDocuments({});
            items = totalItems;
          } else {
            if (itemsPerPage) {
              items = itemsPerPage;
            } else {
              items = 3;
            }
          }
          // define items per page
          const itemsToSkip = (pages - 1) * items;
          const allSoftDeletedTrainee = await TraineeApplicant.find({delete_at:true})
            .skip(itemsToSkip)
            .limit(items);
          return allSoftDeletedTrainee;
        },
    },

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
