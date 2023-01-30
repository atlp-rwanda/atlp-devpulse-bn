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
exports.findOrCreateUser = void 0;
const google_auth_library_1 = require("google-auth-library");
const AuthUser_1 = require("../../models/AuthUser");
const client = new google_auth_library_1.OAuth2Client(process.env.OAUTH_CLIENT_ID);
const findOrCreateUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    const googleUser = yield verifyAuthToken(token);
    //check existance of user
    const user = yield checkIfUserExists(googleUser === null || googleUser === void 0 ? void 0 : googleUser.email);
    return user ? user : createNewUser(googleUser);
});
exports.findOrCreateUser = findOrCreateUser;
const verifyAuthToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID,
        });
        return ticket.getPayload();
    }
    catch (error) {
        console.error("Error verifying token", error);
    }
});
const checkIfUserExists = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield AuthUser_1.LoggedUserModel.findOne({ email }).exec(); });
const createNewUser = (googleUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, picture } = googleUser;
    const user = { name, email, picture, createdAt: new Date().toISOString() };
    return new AuthUser_1.LoggedUserModel(user).save();
});
