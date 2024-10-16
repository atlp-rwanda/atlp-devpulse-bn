import { LoggedUserModel } from "../models/AuthUser";
import { userModel } from "../models/user";
import Notification from "../models/adminNotification";
import { publishNotification } from "./Adminnotification";
export const usersResolvers: any = {
  Query: {
    async user(_: any, args: any, context: any) {
      const id = args.ID;
      const upvalue = await userModel.findById(id);
      return upvalue;
    },
    async getUsers(_: any, amount: any) {
      return await userModel.find().sort({ createdAt: -1 }).limit(amount);
    },
  },
  Mutation: {
    async createUser(
      _: any,
      {
        userInput: {
          //@ts-ignore
          firstName,
          //@ts-ignore
          lastName,
          //@ts-ignore
          email,
        },
      }
    ) {
      const createdUser = new userModel({
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      });

      const res = await createdUser.save();
      await publishNotification(
        `${firstName} ${lastName} has registered as a new User.`,
        "user_registration"
      );
      return res;
    },
    // @ts-ignore
    async deleteUser(_, { ID }) {
      const user = await userModel.findById(ID);
      if (user) {
        await publishNotification(
          `${user.firstName} ${user.lastName} has been deleted`,
          "user_deletion"
        );
      }
      const wasDeleted = (await userModel.deleteOne({ _id: ID })).deletedCount;
      return wasDeleted; //1 if something was deleted, 0 if nothing deleted
    },
    //@ts-ignore
    async updateUser(_, { ID, editUserInput: { firstName, lastName } }) {
      const wasEdited = (
        await userModel.updateOne(
          { _id: ID },
          //@ts-ignore
          { firstName, lastName }
        )
      ).modifiedCount;
      await publishNotification(
        `${firstName} ${lastName} 's information has been updated.`,
        "user_update"
      );
      return wasEdited; //1||true if something was Edited, 0||true if nothing Edited
    },
  },
};
