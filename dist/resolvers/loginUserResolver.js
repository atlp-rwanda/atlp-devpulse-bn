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
exports.loggedUserResolvers = void 0;
const AuthUser_1 = require("../models/AuthUser");
exports.loggedUserResolvers = {
    Query: {
        user_Logged(_, args, ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = args.ID;
                const upvalue = yield AuthUser_1.LoggedUserModel.findById(id);
                return upvalue;
            });
        },
        getUsers_Logged(_, args, ctx, amount) {
            return __awaiter(this, void 0, void 0, function* () {
                // if (!ctx.currentUser) {
                //   throw new AuthenticationError("You must be logged in");
                // }
                return yield AuthUser_1.LoggedUserModel.find().sort({ createdAt: -1 }).limit(amount);
            });
        },
    },
    Mutation: {
        createUser_Logged(_, { userInput: { name, email, picture } }) {
            return __awaiter(this, void 0, void 0, function* () {
                const createdUser = new AuthUser_1.LoggedUserModel({
                    name,
                    email,
                    picture,
                    createdAt: new Date().toISOString(),
                });
                const res = yield createdUser.save(); // MongoDB saving
                return res;
            });
        },
        deleteUser_Logged(_, { ID }) {
            return __awaiter(this, void 0, void 0, function* () {
                const wasDeleted = (yield AuthUser_1.LoggedUserModel.deleteOne({ _id: ID }))
                    .deletedCount;
                return wasDeleted; //1 if something was deleted, 0 if nothing deleted
            });
        },
        updateUser_Logged(_, { ID, editUserInput: { name } }) {
            return __awaiter(this, void 0, void 0, function* () {
                const wasEdited = (yield AuthUser_1.LoggedUserModel.updateOne({ _id: ID }, { name }))
                    .modifiedCount;
                return wasEdited; //1||true if something was Edited, 0||true if nothing Edited
            });
        },
    },
};
