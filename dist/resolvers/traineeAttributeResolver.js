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
exports.traineeAttributeResolver = void 0;
const traineeAttribute_1 = require("../models/traineeAttribute");
const traineeApplicant_1 = __importDefault(require("../models/traineeApplicant"));
exports.traineeAttributeResolver = {
    Query: {
        allTraineesDetails(_, { input }) {
            return __awaiter(this, void 0, void 0, function* () {
                // define page
                const { page, itemsPerPage, All } = input;
                let pages;
                let items;
                if (page) {
                    pages = page;
                }
                else {
                    pages = 1;
                }
                if (All) {
                    // count total items inside the Attributes
                    const totalItems = yield traineeAttribute_1.traineEAttributes.countDocuments({});
                    items = totalItems;
                }
                else {
                    if (itemsPerPage) {
                        items = itemsPerPage;
                    }
                    else {
                        items = 3;
                    }
                }
                // define items per page
                const itemsToSkip = (pages - 1) * items;
                const allTraineeAttribute = yield traineeAttribute_1.traineEAttributes
                    .find({})
                    .populate({
                    path: "trainee_id",
                    populate: {
                        path: "cycle_id",
                        model: "applicationCycle",
                    },
                })
                    .skip(itemsToSkip)
                    .limit(items);
                return allTraineeAttribute;
            });
        },
        getOneTraineeAllDetails(_, { input }) {
            return __awaiter(this, void 0, void 0, function* () {
                const { id } = input;
                const oneTraineeAttribute = yield traineeAttribute_1.traineEAttributes
                    .findOne({ trainee_id: id })
                    .populate({
                    path: "trainee_id",
                    populate: {
                        path: "cycle_id",
                        model: "applicationCycle",
                    },
                })
                    .exec();
                return oneTraineeAttribute;
            });
        },
    },
    Mutation: {
        createTraineeAttribute(_, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const { attributeInput } = args;
                const search_id = args.attributeInput.trainee_id;
                const searchAttribute = yield traineeAttribute_1.traineEAttributes
                    .findOne({ trainee_id: search_id })
                    .populate("trainee_id")
                    .exec();
                const traineeAvailble = yield traineeApplicant_1.default.findOne({
                    _id: search_id,
                });
                if (searchAttribute)
                    throw new Error("Attribute cannot be created multiple times");
                else if (!traineeAvailble)
                    throw new Error(" Trainee with that Id is not found ");
                else {
                    const traineeAttribute = yield traineeAttribute_1.traineEAttributes.create(attributeInput);
                    return traineeAttribute;
                }
            });
        },
        updateTraineeAttribute(parent, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { ID, attributeUpdateInput } = args;
                // const updated = await traineEAttributes.findByIdAndUpdate(
                const updated = yield traineeAttribute_1.traineEAttributes.findOneAndUpdate({ trainee_id: ID }, {
                    gender: attributeUpdateInput.gender,
                    birth_date: attributeUpdateInput.birth_date,
                    Address: attributeUpdateInput.Address,
                    phone: attributeUpdateInput.phone,
                    field_of_study: attributeUpdateInput.field_of_study,
                    education_level: attributeUpdateInput.education_level,
                    province: attributeUpdateInput.province,
                    district: attributeUpdateInput.district,
                    sector: attributeUpdateInput.sector,
                    isEmployed: attributeUpdateInput.isEmployed,
                    haveLaptop: attributeUpdateInput.haveLaptop,
                    isStudent: attributeUpdateInput.isStudent,
                    Hackerrank_score: attributeUpdateInput.Hackerrank_score,
                    english_score: attributeUpdateInput.english_score,
                    interview_decision: attributeUpdateInput.interview_decision,
                    past_andela_programs: attributeUpdateInput.past_andela_programs,
                }, { new: true });
                if (!updated)
                    throw new Error("No Trainee is found, please provide the correct trainee_id");
                return updated;
            });
        },
    },
};
