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
const scoreValueModel_1 = __importDefault(require("../models/scoreValueModel"));
const scoreTypeResolver = {
    Query: {
        getAllScoreValues(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const getScoreValues = yield scoreValueModel_1.default
                    .find({})
                    .populate({
                    path: "attr_id",
                    populate: {
                        path: "trainee_id",
                        populate: {
                            path: "cycle_id",
                        },
                    },
                })
                    .populate({
                    path: "score_id",
                })
                    .exec();
                const vauedDt = getScoreValues.filter((item) => {
                    return item.score_id !== null;
                });
                return vauedDt;
            });
        },
        getOneScoreValue(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const getOneScoreValue = yield scoreValueModel_1.default
                    .findById(args.id)
                    .populate({
                    path: "attr_id",
                    populate: {
                        path: "trainee_id",
                        populate: {
                            path: "cycle_id",
                        },
                    },
                })
                    .populate({
                    path: "score_id",
                })
                    .exec();
                if (!scoreValueModel_1.default)
                    throw new Error("This cohort cycle doesn't exist");
                return getOneScoreValue;
            });
        },
    },
    Mutation: {
        createScoreValue(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                const inputValues = _args.input;
                const attrId = inputValues.map((item) => {
                    return item.attr_id;
                });
                const scoreId = inputValues.map((item) => {
                    return item.score_id;
                });
                const valueArr = inputValues.map(function (item) {
                    return item.score_id;
                });
                const isDuplicate = valueArr.some(function (item, idx) {
                    return valueArr.indexOf(item) != idx;
                });
                const scoreValueExists = yield scoreValueModel_1.default.findOne({
                    attr_id: attrId,
                    score_id: scoreId,
                });
                if (scoreValueExists)
                    throw new Error(`This trainee has already been rated. You can however update the ratings.`);
                const newscoreValue = yield scoreValueModel_1.default.create(inputValues);
                return newscoreValue;
            });
        },
        deleteScoreValue(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                const scoreValueToDelete = yield scoreValueModel_1.default.findById(_args.id);
                if (scoreValueToDelete != null) {
                    const scoreValueDeleted = yield scoreValueModel_1.default.findByIdAndRemove(_args.id);
                    return scoreValueDeleted;
                }
                else {
                    throw new Error("This scoreValuesModel doesn't exist");
                }
            });
        },
        updateScoreValue(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                // const inputValues = _args.input;
                // var newObjId;
                // var lastObjId;
                // var returnedValue: any = {};
                // var arr: any = [];
                // var arr: any = [];
                // for (let i = 0; i < inputValues.length; i++) {
                //   newObjId = inputValues[i].id;
                //   lastObjId = inputValues[i];
                //   const newscoreValue = await scoreValuesModel.findByIdAndUpdate(
                //     newObjId,
                //     lastObjId,
                //     { new: true }
                //   );
                //   arr.push(newscoreValue);
                // }
                // return arr;
                const newscoreType = yield scoreValueModel_1.default.findByIdAndUpdate(_args.id, {
                    score_value: _args.input.score_value,
                }, { new: true });
                return newscoreType;
            });
        },
        updateManyScoreValues(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                const inputValues = _args.input;
                var newObjId;
                var lastObjId;
                var returnedValue = {};
                var arr = [];
                var arr = [];
                for (let i = 0; i < inputValues.length; i++) {
                    newObjId = inputValues[i].id;
                    lastObjId = inputValues[i];
                    const newscoreValue = yield scoreValueModel_1.default.findByIdAndUpdate(newObjId, lastObjId, { new: true });
                    arr.push(newscoreValue);
                }
                return arr;
            });
        },
    },
};
exports.default = scoreTypeResolver;
