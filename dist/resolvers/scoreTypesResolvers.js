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
const scoreTypesModel_1 = __importDefault(require("../models/scoreTypesModel"));
const scoreValueModel_1 = __importDefault(require("../models/scoreValueModel"));
const scoreTypeResolver = {
    Query: {
        getAllScoreTypes() {
            return __awaiter(this, void 0, void 0, function* () {
                const getScoreTypes = yield scoreTypesModel_1.default.find({});
                return getScoreTypes;
            });
        },
        getOneScoreType(parent, args) {
            return __awaiter(this, void 0, void 0, function* () {
                const getOneScoreType = yield scoreTypesModel_1.default.findById(args.id);
                if (!scoreTypesModel_1.default)
                    throw new Error("This cohort cycle doesn't exist");
                return getOneScoreType;
            });
        },
    },
    Mutation: {
        createScoreType(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                const scoreTypeExists = yield scoreTypesModel_1.default.findOne({
                    score_type: _args.input.score_type,
                });
                if (scoreTypeExists)
                    throw new Error("scoreTypesModel already exists");
                const newscoreType = yield scoreTypesModel_1.default.create({
                    score_type: _args.input.score_type,
                });
                return newscoreType;
            });
        },
        deleteScoreType(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                const scoreTypeToDelete = yield scoreTypesModel_1.default.findById(_args.id);
                const scoreValueToDelete = yield scoreValueModel_1.default.findOne({
                    id: "636cfc44786bb77edc253351",
                });
                if (scoreTypeToDelete != null) {
                    const scoreTypeDeleted = yield scoreTypesModel_1.default.findByIdAndRemove(_args.id);
                    return scoreTypeDeleted;
                }
                else {
                    throw new Error("This scoreTypesModel doesn't exist");
                }
            });
        },
        updateScoreType(_parent, _args) {
            return __awaiter(this, void 0, void 0, function* () {
                const newscoreType = yield scoreTypesModel_1.default.findByIdAndUpdate(_args.id, {
                    score_type: _args.input.score_type,
                }, { new: true });
                return newscoreType;
            });
        },
    },
};
exports.default = scoreTypeResolver;
