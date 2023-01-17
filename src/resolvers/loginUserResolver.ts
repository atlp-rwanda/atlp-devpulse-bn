import { AuthenticationError } from "apollo-server";
import { LoggedUserModel } from "../models/AuthUser";

export const loggedUserResolvers: any = {
  Query: {
    async user_Logged(_: any, args: any, ctx: any) {
      const id = args.ID;
      const upvalue = await LoggedUserModel.findById(id);
      return upvalue;
    },
    async getUsers_Logged(_: any, args: any, ctx: any, amount: any) {
      // if (!ctx.currentUser) {
      //   throw new AuthenticationError("You must be logged in");
      // }
      return await LoggedUserModel.find().sort({ createdAt: -1 }).limit(amount);
    },
  },
  Mutation: {
    async createUser_Logged(
      _: any,
      { userInput: { name, email, picture } }: any
    ) {
      const createdUser = new LoggedUserModel({
        name,
        email,
        picture,
        createdAt: new Date().toISOString(),
      });

      const res = await createdUser.save(); // MongoDB saving
      return res;
    },
    async deleteUser_Logged(_: any, { ID }: any) {
      const wasDeleted = (await LoggedUserModel.deleteOne({ _id: ID }))
        .deletedCount;
      return wasDeleted; //1 if something was deleted, 0 if nothing deleted
    },

    async updateUser_Logged(_: any, { ID, editUserInput: { name } }: any) {
      const wasEdited = (await LoggedUserModel.updateOne({ _id: ID }, { name }))
        .modifiedCount;
      return wasEdited; //1||true if something was Edited, 0||true if nothing Edited
    },
  },
};
