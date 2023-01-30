"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traineEAttributes = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const traineeAttributeSchema = new mongoose_1.Schema({
    gender: {
        type: String,
        required: true,
        default: "-",
    },
    birth_date: {
        type: Date,
        required: true,
        default: "01/01/2000",
    },
    Address: {
        type: String,
        required: true,
        default: "-",
    },
    phone: {
        type: String,
        required: true,
        default: "-",
    },
    field_of_study: {
        type: String,
        required: true,
        default: "-",
    },
    education_level: {
        type: String,
        required: true,
        default: "-",
    },
    province: {
        type: String,
        required: true,
        default: "-",
    },
    district: {
        type: String,
        required: true,
        default: "-",
    },
    sector: {
        type: String,
        required: true,
        default: "-",
    },
    isEmployed: {
        type: Boolean,
        required: true,
        default: true,
    },
    haveLaptop: {
        type: Boolean,
        required: true,
        default: true,
    },
    isStudent: {
        type: Boolean,
        required: true,
        default: true,
    },
    Hackerrank_score: {
        type: String,
        required: true,
        default: "-",
    },
    english_score: {
        type: String,
        required: true,
        default: "-",
    },
    interview: {
        type: Number,
    },
    interview_decision: {
        type: String,
        required: true,
        default: "-",
    },
    past_andela_programs: {
        type: String,
        default: "none",
    },
    trainee_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Trainee",
        required: true,
    },
});
const traineEAttributes = (0, mongoose_1.model)("Attributes", traineeAttributeSchema);
exports.traineEAttributes = traineEAttributes;
