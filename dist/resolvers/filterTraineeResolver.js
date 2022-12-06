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
const traineeAttribute_1 = require("../models/traineeAttribute");
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
                const nonNullTrainee = allTraineeAttribute.filter((value) => {
                    return value !== null;
                });
                if (wordEntered && !filterAttribute) {
                    const filterResult = nonNullTrainee.filter((value) => {
                        return (value._id
                            .toString()
                            .toLowerCase()
                            .includes(wordEntered.toString().toLowerCase()) ||
                            value.gender
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.birth_date
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.Address.toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.phone
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.field_of_study
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.education_level
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.province
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.district
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.sector
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.isEmployed
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.haveLaptop
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.isStudent
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.Hackerrank_score.toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.interview_decision
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.past_andela_programs
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.trainee_id._id
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.trainee_id.email
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.trainee_id.firstName
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.trainee_id.lastName
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.trainee_id.delete_at
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()));
                    });
                    return filterResult;
                }
                if (wordEntered && filterAttribute) {
                    const filterAttributeResult = allTraineeAttribute.filter((value) => {
                        let arr = Object.keys(value.trainee_id.toJSON());
                        let arr1 = Object.keys(value.toJSON());
                        let allKeys = arr.concat(arr1);
                        for (let i = 0; i < allKeys.length; i++) {
                            if (allKeys[i].toLowerCase() == filterAttribute.toLowerCase()) {
                                usedAttribute = allKeys[i];
                            }
                        }
                        if (arr.includes(usedAttribute)) {
                            return value.trainee_id[usedAttribute]
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase());
                        }
                        else if (arr1.includes(usedAttribute)) {
                            return value[usedAttribute]
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase());
                        }
                        else {
                            return [];
                        }
                    });
                    return filterAttributeResult;
                }
                // Return all attributes otherwise
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
