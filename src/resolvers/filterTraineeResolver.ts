import { traineEAttributes } from "../models/traineeAttribute.js";
import TraineeApplicant from "../models/traineeApplicant.js";

const filterTraineeResolver: any = {
  Query: {
    async filterTraineesDetails(_: any, { input }: any) {
      // define page
      const { page, itemsPerPage, All, wordEntered, filterAttribute } = input;
      let pages;
      let items;
      let usedAttribute: any;
      if (page) {
        pages = page;
      } else {
        pages = 1;
      }
      if (All) {
        // count total items inside the Attributes
        const totalItems = await traineEAttributes.countDocuments({});
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
      let allTraineeAttribute
      if(wordEntered==''){
      const docs=await TraineeApplicant.find({delete_at:false},{_id:1})
      const ids= docs.map((doc)=>doc._id)
      const allTraineeAttribute = await traineEAttributes
        .find({trainee_id:{$in:ids}})
        .populate({
          path: "trainee_id",
          populate: {
            path: "cycle_id",
            model: "applicationCycle",
          },
        })
        .skip(itemsToSkip)
        .limit(items);
        return allTraineeAttribute
      }
      //   const nonNullTrainee = allTraineeAttribute.filter((value) => {
      //   return value !== null;
      // });
      enum traineeAplicant {email = <any>'email',firstName = <any>'firstName',lastName = <any>'lastName',status=<any>'status',_id=<any>'_id'}
      enum traineeAttribute {Address = <any>'Address',province = <any>'province',district = <any>'district',sector = <any>'sector',gender = <any>'gender', birth_date= <any>'birth_date',phone= <any>'phone',field_of_study= <any>'field_of_study',education_level= <any>'education_level',isEmployed= <any>'isEmployed',haveLaptop= <any>'haveLaptop',isStudent= <any>'isStudent',Hackerrank_score= <any>'Hackerrank_score',english_score= <any>'english_score',interview= <any>'interview',interview_decision= <any>'interview_decision',past_andela_programs= <any>'past_andela_programs'}
      if (filterAttribute in traineeAplicant && wordEntered!=='') {
        try {
        const docs=await TraineeApplicant.find({[filterAttribute]:{$regex: wordEntered,$options: 'i'}},{_id:1})
        const ids= docs.map((doc)=>doc._id)
        const allTraineeAttribute = await traineEAttributes
        .find({trainee_id:{$in:ids}})
        .populate({
          path: "trainee_id",
          populate: {
            path: "cycle_id",
            model: "applicationCycle",
          },
        })
        .skip(itemsToSkip)
        .limit(items);
        return allTraineeAttribute
        } catch (error) {
          return []
        }

      }
      if (filterAttribute in traineeAttribute && wordEntered!=='') {
        console.log(wordEntered,filterAttribute)
        try {
        const allTraineeAttribute = await traineEAttributes
        .find({[filterAttribute]:{$regex: wordEntered,$options: 'i'}})
        .populate({
          path: "trainee_id",
          populate: {
            path: "cycle_id",
            model: "applicationCycle",
          },
        })
        .skip(itemsToSkip)
        .limit(items);
        console.log(allTraineeAttribute)
        return allTraineeAttribute
          
        } catch (error) {
          console.log(error)
          return []
        }
  
      }
      
      return allTraineeAttribute;
    },
    async getAlltraineEAttributescount(){
        const AlltraineEAttributescount = await traineEAttributes.count();
        return {total:AlltraineEAttributescount};
      },
  },
};

export default filterTraineeResolver;
