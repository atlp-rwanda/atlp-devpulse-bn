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
const traineeApplicant_1 = __importDefault(require("../models/traineeApplicant"));
const seedDeleteTrainee = () => __awaiter(void 0, void 0, void 0, function* () {
    const deleteTrainee = [
        {
            email: 'beniraa@gmail.com',
            firstName: 'Ben',
            lastName: 'iraa',
            deleted_at: false
        },
        {
            email: 'ben@gmail.com',
            firstName: 'iradukunda',
            lastName: 'benjamin',
            deleted_at: false
        },
        {
            email: 'carlos@gmail.com',
            firstName: 'carlos',
            lastName: 'Bz',
            deleted_at: false
        },
        {
            email: 'nshuti@gmail.com',
            firstName: 'blaise',
            lastName: 'k',
            deleted_at: false
        },
    ];
    yield traineeApplicant_1.default.deleteMany({});
    yield traineeApplicant_1.default.insertMany(deleteTrainee);
    return null;
});
exports.default = seedDeleteTrainee;
