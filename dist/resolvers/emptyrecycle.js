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
exports.recyclebinresolver = void 0;
const traineeApplicant_1 = __importDefault(require("../models/traineeApplicant"));
exports.recyclebinresolver = {
    Query: {
        allSoftDeletedTrainees(_, { input }) {
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
                const allSoftDeletedTrainee = yield traineeApplicant_1.default.find({ delete_at: true })
                    .skip(itemsToSkip)
                    .limit(items);
                return allSoftDeletedTrainee;
            });
        },
    },
    Mutation: {
        emptyRecyclebin(_) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const resp = yield traineeApplicant_1.default.deleteMany({ delete_at: true });
                    if (resp.deletedCount == 0) {
                        return { __typename: 'NotFoundError', message: `recycle bin is empty` };
                    }
                    else {
                        return Object.assign({ __typename: 'traineeApplicant' }, resp);
                    }
                }
                catch (error) {
                    if (error[0].message) {
                        return { __typename: 'NotFoundError', message: `${error[0].message}` };
                    }
                }
            });
        }
    }
};
