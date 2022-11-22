import { additionalAttributesField }  from '../models/additionalAttributes';
import { traineEAttributes } from '../models/traineeAttribute';
const additionalAttributesFieldResolver:any={
    Query: {
        async getAllAdditionalAttributesFields(){
            const getAdditionalAttributesFields = await additionalAttributesField.find({});
            return getAdditionalAttributesFields;
          },
         async getAdditionalAttributesField(parent:any, args:any){
          const getOneAdditionalAttributesField = await additionalAttributesField.findById(args.id)
          if(!additionalAttributesField) throw new Error("This additionalAttributesField doesn't exist");
          return getOneAdditionalAttributesField;
          
          
         },
        },
         Mutation: {
            async createAdditionalAttributesField(_parent:any,_args:any) {
                // const additionalAttributesFieldExists = await additionalAttributesField.findOne({ fieldName: _args.input.id });
                const searchAttribute = await traineEAttributes
                .findOne({ trainee_id: _args.input.id })
                .populate("trainee_id")
                .exec();
                if (searchAttribute) {
                  const newAdditionalAttributesField= await additionalAttributesField.create({fieldName:_args.input.fieldName, keyvalue: _args.input.keyvalue });
                  // await traineEAttributes.push({ additional_fields : newAdditionalAttributesField});
                  await traineEAttributes.findOneAndUpdate(
                    {trainee_id: searchAttribute.trainee_id},
                    {
                      additional_fields: newAdditionalAttributesField.id,
                    },
                    { new: true }
                  )
                  return newAdditionalAttributesField;

                } else throw new Error("This id's attribute doesn't exists!");
              }
            }
   
}
export default additionalAttributesFieldResolver