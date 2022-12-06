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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
// add your own uri below
const uri = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_PROD_DB
    : process.env.NODE_ENV === 'test'
        ? process.env.MONGO_TEST_DB
        : process.env.MONGO_DEV_DB;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //MONGODB CONNECTION
        yield mongoose_1.default.connect(uri);
    }
    catch (error) {
        console.log(`Database connection error: ${error}`);
        process.exit(1);
    }
});
exports.connect = connect;
