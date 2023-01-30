"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersResolvers = void 0;
const user_1 = require("../models/user");
exports.usersResolvers = {
    Query: {
        user(_, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = args.ID;
                const upvalue = yield user_1.userModel.findById(id);
                return upvalue;
            });
        },
        getUsers(_, amount) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield user_1.userModel.find().sort({ createdAt: -1 }).limit(amount);
            });
        },
    },
    Mutation: {
        createUser(_, { userInput: { 
        //@ts-ignore
        firstName, 
        //@ts-ignore
        lastName, 
        //@ts-ignore
        email }, }) {
            return __awaiter(this, void 0, void 0, function* () {
                const createdUser = new user_1.userModel({
                    firstName,
                    lastName,
                    email,
                    createdAt: new Date().toISOString(),
                });
                const res = yield createdUser.save(); // MongoDB saving
                return res;
            });
        },
        // @ts-ignore
        deleteUser(_, { ID }) {
            return __awaiter(this, void 0, void 0, function* () {
                const wasDeleted = (yield user_1.userModel.deleteOne({ _id: ID }))
                    .deletedCount;
                return wasDeleted; //1 if something was deleted, 0 if nothing deleted
            });
        },
        //@ts-ignore
        updateUser(_, { ID, editUserInput: { firstName, lastName } }) {
            return __awaiter(this, void 0, void 0, function* () {
                const wasEdited = (yield user_1.userModel.updateOne({ _id: ID }, 
                //@ts-ignore
                { firstName, lastName }))
                    .modifiedCount;
                return wasEdited; //1||true if something was Edited, 0||true if nothing Edited
            });
        },
    },
};
