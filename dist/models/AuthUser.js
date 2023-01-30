"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedUserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    createdAt: String,
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    picture: String,
});
exports.LoggedUserModel = (0, mongoose_1.model)("LoggedUserModel", userSchema);
