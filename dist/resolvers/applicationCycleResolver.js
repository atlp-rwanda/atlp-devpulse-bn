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
const applicationCycle_1 = require("../models/applicationCycle");
const traineeApplicant_1 = __importDefault(require("../models/traineeApplicant"));
const applicationCycleResolver = {
    Query: {
        getAllApplicationCycles() {
            return __awaiter(this, void 0, void 0, function* () {
                const getcohortCycles = yield applicationCycle_1.applicationCycle.find({});
                return getcohortCycles;
            });
        },
        applicationCycle(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const getOneapplicationCycle = yield applicationCycle_1.applicationCycle.findById(args.id);
                if (!applicationCycle_1.applicationCycle)
                    throw new Error("This cohort cycle doesn't exist");
                return getOneapplicationCycle;
            });
        },
    },
    Mutation: {
        createApplicationCycle(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                const applicationCycleExists = yield applicationCycle_1.applicationCycle.findOne({ name: _args.name });
                if (applicationCycleExists)
                    throw new Error("applicationCycle already exists");
                const newapplicationCycle = yield applicationCycle_1.applicationCycle.create({ name: _args.input.name, startDate: _args.input.startDate, endDate: _args.input.endDate, });
                return newapplicationCycle;
            });
        },
        deleteApplicationCycle(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                const applicationCycleToDelete = yield applicationCycle_1.applicationCycle.findById(_args.id);
                if (applicationCycleToDelete != null) {
                    const user = yield traineeApplicant_1.default.findOne({ cycle_id: _args.id });
                    if (user) {
                        throw new Error(`cycle has some applicants`);
                    }
                    else {
                        const applicationCycleDeleted = yield applicationCycle_1.applicationCycle.findByIdAndRemove(_args.id);
                        return applicationCycleDeleted;
                    }
                }
                else {
                    throw new Error("This applicationCycle doesn't exist");
                }
            });
        },
        updateApplicationCycle(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                const newapplicationCycle = yield applicationCycle_1.applicationCycle.findByIdAndUpdate(_args.id, { name: _args.input.name, startDate: _args.input.startDate, endDate: _args.input.endDate }, { new: true });
                return newapplicationCycle;
            });
        },
    }
};
exports.default = applicationCycleResolver;
