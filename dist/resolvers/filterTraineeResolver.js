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
const traineeAttribute_1 = require("../models/traineeAttribute");
const traineeApplicant_1 = __importDefault(require("../models/traineeApplicant"));
const filterTraineeResolver = {
    Query: {
        filterTraineesDetails(_, { input }) {
            return __awaiter(this, void 0, void 0, function* () {
                // define page
                const { page, itemsPerPage, All, wordEntered, filterAttribute } = input;
                let pages;
                let items;
                let usedAttribute;
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
                let allTraineeAttribute;
                if (wordEntered == '') {
                    const docs = yield traineeApplicant_1.default.find({ delete_at: false }, { _id: 1 });
                    const ids = docs.map((doc) => doc._id);
                    const allTraineeAttribute = yield traineeAttribute_1.traineEAttributes
                        .find({ trainee_id: { $in: ids } })
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
                }
                //   const nonNullTrainee = allTraineeAttribute.filter((value) => {
                //   return value !== null;
                // });
                let traineeAplicant;
                (function (traineeAplicant) {
                    traineeAplicant[traineeAplicant["email"] = 'email'] = "email";
                    traineeAplicant[traineeAplicant["firstName"] = 'firstName'] = "firstName";
                    traineeAplicant[traineeAplicant["lastName"] = 'lastName'] = "lastName";
                    traineeAplicant[traineeAplicant["status"] = 'status'] = "status";
                    traineeAplicant[traineeAplicant["_id"] = '_id'] = "_id";
                })(traineeAplicant || (traineeAplicant = {}));
                let traineeAttribute;
                (function (traineeAttribute) {
                    traineeAttribute[traineeAttribute["Address"] = 'Address'] = "Address";
                    traineeAttribute[traineeAttribute["province"] = 'province'] = "province";
                    traineeAttribute[traineeAttribute["district"] = 'district'] = "district";
                    traineeAttribute[traineeAttribute["sector"] = 'sector'] = "sector";
                    traineeAttribute[traineeAttribute["gender"] = 'gender'] = "gender";
                    traineeAttribute[traineeAttribute["birth_date"] = 'birth_date'] = "birth_date";
                    traineeAttribute[traineeAttribute["phone"] = 'phone'] = "phone";
                    traineeAttribute[traineeAttribute["field_of_study"] = 'field_of_study'] = "field_of_study";
                    traineeAttribute[traineeAttribute["education_level"] = 'education_level'] = "education_level";
                    traineeAttribute[traineeAttribute["isEmployed"] = 'isEmployed'] = "isEmployed";
                    traineeAttribute[traineeAttribute["haveLaptop"] = 'haveLaptop'] = "haveLaptop";
                    traineeAttribute[traineeAttribute["isStudent"] = 'isStudent'] = "isStudent";
                    traineeAttribute[traineeAttribute["Hackerrank_score"] = 'Hackerrank_score'] = "Hackerrank_score";
                    traineeAttribute[traineeAttribute["english_score"] = 'english_score'] = "english_score";
                    traineeAttribute[traineeAttribute["interview"] = 'interview'] = "interview";
                    traineeAttribute[traineeAttribute["interview_decision"] = 'interview_decision'] = "interview_decision";
                    traineeAttribute[traineeAttribute["past_andela_programs"] = 'past_andela_programs'] = "past_andela_programs";
                })(traineeAttribute || (traineeAttribute = {}));
                if (filterAttribute in traineeAplicant && wordEntered !== '') {
                    try {
                        const docs = yield traineeApplicant_1.default.find({ [filterAttribute]: { $regex: wordEntered, $options: 'i' } }, { _id: 1 });
                        const ids = docs.map((doc) => doc._id);
                        const allTraineeAttribute = yield traineeAttribute_1.traineEAttributes
                            .find({ trainee_id: { $in: ids } })
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
                    }
                    catch (error) {
                        return [];
                    }
                }
                if (filterAttribute in traineeAttribute && wordEntered !== '') {
                    console.log(wordEntered, filterAttribute);
                    try {
                        const allTraineeAttribute = yield traineeAttribute_1.traineEAttributes
                            .find({ [filterAttribute]: { $regex: wordEntered, $options: 'i' } })
                            .populate({
                            path: "trainee_id",
                            populate: {
                                path: "cycle_id",
                                model: "applicationCycle",
                            },
                        })
                            .skip(itemsToSkip)
                            .limit(items);
                        console.log(allTraineeAttribute);
                        return allTraineeAttribute;
                    }
                    catch (error) {
                        console.log(error);
                        return [];
                    }
                }
                return allTraineeAttribute;
            });
        },
        getAlltraineEAttributescount() {
            return __awaiter(this, void 0, void 0, function* () {
                const AlltraineEAttributescount = yield traineeAttribute_1.traineEAttributes.count();
                return { total: AlltraineEAttributescount };
            });
        },
    },
};
exports.default = filterTraineeResolver;
