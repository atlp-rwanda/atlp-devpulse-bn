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
const traineeResolvers = {
    Query: {
        getAllTrainees(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const gettrainee = yield traineeApplicant_1.default.find({
                    delete_at: false,
                }).populate("cycle_id");
                return gettrainee;
            });
        },
        getAllSoftDeletedTraineesFiltered(_, { input }) {
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
                    // count total items inside the collections
                    const totalItems = yield traineeApplicant_1.default.countDocuments({});
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
                const getAllSoftDeletedTrainee = yield traineeApplicant_1.default.find({
                    delete_at: true,
                })
                    .populate("cycle_id")
                    .skip(itemsToSkip)
                    .limit(items);
                const nonNullTrainee = getAllSoftDeletedTrainee.filter((value) => {
                    return value !== null;
                });
                if (wordEntered && !filterAttribute) {
                    const filterResult = nonNullTrainee.filter((value) => {
                        return (value._id
                            .toString()
                            .toLowerCase()
                            .includes(wordEntered.toString().toLowerCase()) ||
                            value.email
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.firstName
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.lastName
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.delete_at
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.cycle_id._id
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.cycle_id.name
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.cycle_id.startDate
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()) ||
                            value.cycle_id.endDate
                                .toString()
                                .toLowerCase()
                                .includes(wordEntered.toString().toLowerCase()));
                    });
                    return filterResult;
                }
                if (wordEntered && filterAttribute) {
                    const filterAttributeResult = getAllSoftDeletedTrainee.filter((value) => {
                        let arr = Object.keys(value.cycle_id.toJSON());
                        let arr1 = Object.keys(value.toJSON());
                        let allKeys = arr.concat(arr1);
                        for (let i = 0; i < allKeys.length; i++) {
                            if (allKeys[i].toLowerCase() == filterAttribute.toLowerCase()) {
                                usedAttribute = allKeys[i];
                            }
                        }
                        if (arr.includes(usedAttribute)) {
                            return value.cycle_id[usedAttribute]
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
                return getAllSoftDeletedTrainee;
            });
        },
        traineeSchema(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const getOnetrainee = yield traineeApplicant_1.default.findById(args.id).populate("cycle_id");
                if (!getOnetrainee)
                    throw new Error("trainee doesn't exist");
                return getOnetrainee;
            });
        },
    },
    Mutation: {
        deleteTrainee(parent, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const deleteTrainee = yield traineeApplicant_1.default.findById(args.id).populate("cycle_id");
                if (!deleteTrainee)
                    throw new Error(" Trainee doesn't exist");
                const deletedTrainee = yield traineeApplicant_1.default.findByIdAndRemove(args.id).populate("cycle_id");
                return deletedTrainee;
            });
        },
        softdeleteTrainee(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const trainee = yield traineeApplicant_1.default.findById(args.input.id).populate("cycle_id");
                if (!trainee)
                    throw new Error("Trainee doesn't exist");
                const softDelete = yield traineeApplicant_1.default.findByIdAndUpdate(args.input.id, { $set: { delete_at: true, id: args.input.id } }, { new: true }).populate("cycle_id");
                return softDelete;
            });
        },
        softRecover(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const trainee = yield traineeApplicant_1.default.findById(args.input.id).populate("cycle_id");
                if (!trainee)
                    throw new Error("Trainee doesn't exist");
                const softRecovered = yield traineeApplicant_1.default.findByIdAndUpdate(args.input.id, { $set: { delete_at: false, id: args.input.id } }, { new: true }).populate("cycle_id");
                return softRecovered;
            });
        },
    },
};
exports.default = traineeResolvers;
