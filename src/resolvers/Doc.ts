import { docModels } from "../models/doc";

export const docResolver:any={
    Query:{
        async getDoc(_:any,args:any){
            const doc=await docModels.findOne({_id:args.id});
            return doc;
        },
        async getAllDocs(){
            const docs=await docModels.find();
            return docs;
        },
        async getDocByRole(_:any,args:any){
            const {role}=args;
            const docs=await docModels.find({role:role})
            return docs
        }
    },
    Mutation:{
        async createDoc(_:any,args:any){
            const {title,description,role}=args.docFields;
            const doc=await docModels.create({
                title:title,
                description:description,
                role:role
            });
            return doc;
        },
        async deleteDoc(_:any,args:any){
            const doc= await docModels.findOneAndDelete({id:args.id})
            return doc;
        },
        async updateDoc(_:any,args:any){
            const {id}=args;
            const {title,description,role}=args.docFields
            let doc=await docModels.findOne({_id:id});
            if(!doc){
                return "Document don't exist"
            }
            doc.title=title;
            doc.description=description;
            doc.role=role
            await doc?.save()
            return doc
        }
    }
}