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
exports.traineeApplicantResolver = void 0;
const traineeApplicant_1 = __importDefault(require("../models/traineeApplicant"));
const traineeAttribute_1 = require("../models/traineeAttribute");
const applicationCycle_1 = require("../models/applicationCycle");
const mongoose_1 = __importDefault(require("mongoose"));
exports.traineeApplicantResolver = {
    Query: {
        allTrainees(_, { input }) {
            return __awaiter(this, void 0, void 0, function* () {
                // define page
                const { page, itemsPerPage, All } = input;
                let pages;
                let items;
                const totalItems = yield traineeApplicant_1.default.countDocuments({});
                if (page && page > 1) {
                    pages = page;
                }
                else {
                    pages = 1;
                }
                if (All) {
                    // count total items inside the collections
                    items = totalItems;
                }
                else {
                    if (itemsPerPage && itemsPerPage > 0) {
                        items = itemsPerPage;
                    }
                    else {
                        items = 3;
                    }
                }
                // define items per page
                const itemsToSkip = (pages - 1) * items;
                const allTrainee = yield traineeApplicant_1.default.find({ delete_at: false })
                    .populate("cycle_id")
                    // .populate("applicant_id")
                    .skip(itemsToSkip)
                    .limit(items);
                const traineeApplicant = allTrainee;
                return {
                    data: traineeApplicant,
                    totalItems,
                    page: pages,
                    itemsPerPage: items,
                };
            });
        },
        getOneTrainee(_, { ID }) {
            return __awaiter(this, void 0, void 0, function* () {
                const trainee = yield traineeApplicant_1.default.findById(ID).populate("cycle_id");
                if (!trainee)
                    throw new Error("No trainee is found, pleade provide the correct ID");
                return trainee;
            });
        },
    },
    Mutation: {
        updateTraineeApplicant(parent, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { ID, updateInput } = args;
                if (updateInput.cycle_id) {
                    const cycle = yield applicationCycle_1.applicationCycle.findById(updateInput.cycle_id);
                    if (!cycle) {
                        throw new Error("the cycle provided does not exist");
                    }
                }
                const updated = yield traineeApplicant_1.default.findByIdAndUpdate(ID, {
                    firstName: updateInput.firstName,
                    lastName: updateInput.lastName,
                    status: updateInput.status,
                    cycle_id: new mongoose_1.default.Types.ObjectId(updateInput.cycle_id),
                }, { new: true }).populate("cycle_id");
                return updated;
            });
        },
        deleteTraineeApplicant(parent, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const emailInput = args.email;
                const oneTraineeApplicant = yield traineeApplicant_1.default.findOne({
                    email: emailInput,
                })
                    .populate("cycle_id")
                    .exec();
                const idToDelete = oneTraineeApplicant === null || oneTraineeApplicant === void 0 ? void 0 : oneTraineeApplicant._id;
                const trainee = yield traineeApplicant_1.default.deleteOne({ email: emailInput });
                if (trainee.deletedCount) {
                    const upDate = yield traineeAttribute_1.traineEAttributes.updateOne({ trainee_id: idToDelete }, { trainee_id: null });
                    if (upDate) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            });
        },
        createNewTraineeApplicant(parent, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const newTrainee = args.input;
                const emailTest = args.input.email;
                const cycle = yield applicationCycle_1.applicationCycle.findById(args.input.cycle_id);
                if (!cycle) {
                    throw new Error("the cycle provided does not exist");
                }
                const validateEmail = (email) => {
                    return String(email)
                        .toLowerCase()
                        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                };
                if (validateEmail(emailTest) == null)
                    throw new Error("This email is not valid please provide a valid email");
                const traineeToCreate = yield traineeApplicant_1.default.create(newTrainee);
                const trainee_id = traineeToCreate._id;
                const newTraineeAttribute = yield traineeAttribute_1.traineEAttributes.create({
                    trainee_id: trainee_id,
                });
                return traineeToCreate.populate("cycle_id");
            });
        },
    },
};
