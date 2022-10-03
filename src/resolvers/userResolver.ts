import { userModel } from "../models/user";
export const usersResolvers:any = {
  Query: {
    async user(_:any,  args:any, context:any ) {
      console.log('args', args.ID)
      const id = args.ID
      const upvalue= await userModel.findById(id);
      console.log('Update value', upvalue)
      return upvalue

    },
    async getUsers(_:any, amount:any) {
      return await userModel.find().sort({ createdAt: -1 }).limit(amount);
    },
  },
  Mutation: {
      async createUser(_:any,
      {
        userInput: {
          //@ts-ignore
          firstName,
           //@ts-ignore
          lastName,
           //@ts-ignore
          email
        },
      }
    ) {
      const createdUser = new userModel({
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      });

      const res = await createdUser.save(); // MongoDB saving
      console.log("results", res);
      return res;
    },
     // @ts-ignore
    async deleteUser(_, { ID }) {
      const wasDeleted = (await userModel.deleteOne({ _id: ID }))
        .deletedCount;
      return wasDeleted; //1 if something was deleted, 0 if nothing deleted
    },
 //@ts-ignore
    async updateUser(_, { ID, editUserInput: { firstName, lastName } }) {
      const wasEdited = (
        await userModel.updateOne(
          { _id: ID },
          //@ts-ignore
          { firstName, lastName}
        )
        )
        .modifiedCount;
      // console.log('Was edited',wasEdited)
      return wasEdited; //1||true if something was Edited, 0||true if nothing Edited
    },
  },
};


