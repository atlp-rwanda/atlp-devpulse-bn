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
const traineeAttribute_1 = require("../models/traineeAttribute");
const googleapis_1 = require("googleapis");
const applicationCycle_1 = require("../models/applicationCycle");
const loadTraineeResolver = {
    Query: {
        getAllTraineeApplicant() {
            return __awaiter(this, void 0, void 0, function* () {
                const trainees = yield traineeApplicant_1.default.find({}).populate("cycle_id");
                return trainees;
            });
        },
        getAllTraineeAtributes() {
            return __awaiter(this, void 0, void 0, function* () {
                const traineesAttribute = yield traineeAttribute_1.traineEAttributes.find({}).populate({
                    path: "trainee_id",
                    populate: {
                        path: "cycle_id",
                        model: "applicationCycle",
                    },
                });
                return traineesAttribute;
            });
        },
    },
    Mutation: {
        loadAllTrainees(_parent, _args) {
            var _a, _b, _c, _d, _e, _f, _g;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const auth = new googleapis_1.google.auth.GoogleAuth({
                        keyFile: "credentials.json",
                        scopes: "https://www.googleapis.com/auth/spreadsheets",
                    });
                    //create client instance for auth
                    const client = yield auth.getClient();
                    //instance of google sheets API
                    const googleSheets = googleapis_1.google.sheets({
                        version: "v4",
                        auth: client,
                    });
                    //read rows from spreadsheet
                    const spreadsheetId = _args.spreadsheetId;
                    const rows = yield googleSheets.spreadsheets.values.get({
                        auth,
                        spreadsheetId,
                        range: "Sheet1",
                    });
                    const validationArray = [
                        "firstName",
                        "lastName",
                        "email",
                        "gender",
                        "birth_date",
                        "phone",
                        "field_of_study",
                        "education_level",
                        "province",
                        "district",
                        "isEmployed",
                        "isStudent",
                        "Hackerrank_score",
                        "english_score",
                        "interview",
                        "interview_decision",
                        "past_andela_programs",
                        "Address",
                        "sector",
                        "haveLaptop",
                        "cycle_name",
                    ];
                    const getIndexArrOfTheTrainee = (correctColumnOfProperty) => {
                        const arrayOfTraineeProperties = ["firstName", "lastName", "email"];
                        const traineeIndexArray = [];
                        for (let i = 0; i < arrayOfTraineeProperties.length; i++) {
                            // @ts-ignore
                            if (correctColumnOfProperty.includes(arrayOfTraineeProperties[i])) {
                                // @ts-ignore
                                const index = correctColumnOfProperty.indexOf(arrayOfTraineeProperties[i]);
                                traineeIndexArray.push(index);
                            }
                        }
                        return traineeIndexArray;
                    };
                    const giveMeDataInACorrectFormatTrainee = (arrOfAllRows, correctColumnArr, arrOfTraineeIndexes) => {
                        const arrOfObject = [];
                        for (let i = 1; i < arrOfAllRows.length; i++) {
                            arrOfObject.push({
                                [correctColumnArr[arrOfTraineeIndexes[0]]]: arrOfAllRows[i][arrOfTraineeIndexes[0]],
                                [correctColumnArr[arrOfTraineeIndexes[1]]]: arrOfAllRows[i][arrOfTraineeIndexes[1]],
                                [correctColumnArr[arrOfTraineeIndexes[2]]]: arrOfAllRows[i][arrOfTraineeIndexes[2]],
                            });
                        }
                        return arrOfObject;
                    };
                    const replaceNoOrYesWithTrueOrFalseFunc = (dataObject) => {
                        let finObject = Object.assign({}, dataObject);
                        if (dataObject.isEmployed.toLowerCase() === "no") {
                            finObject = Object.assign(Object.assign({}, finObject), { isEmployed: false });
                        }
                        if (dataObject.haveLaptop.toLowerCase() === "no") {
                            finObject = Object.assign(Object.assign({}, finObject), { haveLaptop: false });
                        }
                        if (dataObject.isStudent.toLowerCase() === "no") {
                            finObject = Object.assign(Object.assign({}, finObject), { isStudent: false });
                        }
                        if (dataObject.isStudent.toLowerCase() === "yes") {
                            finObject = Object.assign(Object.assign({}, finObject), { isStudent: true });
                        }
                        if (dataObject.haveLaptop.toLowerCase() === "yes") {
                            finObject = Object.assign(Object.assign({}, finObject), { haveLaptop: true });
                        }
                        if (dataObject.isEmployed.toLowerCase() === "yes") {
                            finObject = Object.assign(Object.assign({}, finObject), { isEmployed: true });
                        }
                        return finObject;
                    };
                    const giveMeDataInACorrectFormatAttributes = (arr, arrOfCorrectColumnProperties) => {
                        const arrOfObject = [];
                        for (let i = 1; i < arr.length; i++) {
                            arrOfObject.push({
                                [arrOfCorrectColumnProperties[3]]: arr[i][3],
                                [arrOfCorrectColumnProperties[4]]: arr[i][4],
                                [arrOfCorrectColumnProperties[5]]: arr[i][5],
                                [arrOfCorrectColumnProperties[6]]: arr[i][6],
                                [arrOfCorrectColumnProperties[7]]: arr[i][7],
                                [arrOfCorrectColumnProperties[8]]: arr[i][8],
                                [arrOfCorrectColumnProperties[9]]: arr[i][9],
                                [arrOfCorrectColumnProperties[10]]: arr[i][10],
                                [arrOfCorrectColumnProperties[11]]: arr[i][11],
                                [arrOfCorrectColumnProperties[12]]: arr[i][12],
                                [arrOfCorrectColumnProperties[13]]: arr[i][13],
                                [arrOfCorrectColumnProperties[14]]: arr[i][14],
                                [arrOfCorrectColumnProperties[15]]: arr[i][15],
                                [arrOfCorrectColumnProperties[16]]: arr[i][16],
                                [arrOfCorrectColumnProperties[17]]: arr[i][17],
                                [arrOfCorrectColumnProperties[18]]: arr[i][18],
                                [arrOfCorrectColumnProperties[19]]: arr[i][19],
                                [arrOfCorrectColumnProperties[20]]: arr[i][20],
                                [arrOfCorrectColumnProperties[0]]: arr[i][0],
                                [arrOfCorrectColumnProperties[1]]: arr[i][1],
                                [arrOfCorrectColumnProperties[2]]: arr[i][2],
                            });
                        }
                        // @ts-ignore
                        const arrOfAttributesData = arrOfObject.map((item) => {
                            delete item["firstName"];
                            delete item["lastName"];
                            delete item["email"];
                            const cycle_id = item["cycle_name"];
                            delete item["cycle_name"];
                            const attributesObject = replaceNoOrYesWithTrueOrFalseFunc(item);
                            return {
                                attributes: attributesObject,
                                cycle_id: cycle_id,
                            };
                        });
                        return arrOfAttributesData;
                    };
                    const SPValuesArr = rows.data.values;
                    let newErrorArr = [0][0];
                    let retunedNewUnmached = [];
                    //loop through rows and add them to our db
                    if (rows.data.values !== undefined && rows.data.values !== null) {
                        for (let i = 0; i < ((_b = (_a = rows.data) === null || _a === void 0 ? void 0 : _a.values[0]) === null || _b === void 0 ? void 0 : _b.length); i++) {
                            if (!validationArray.includes(SPValuesArr[0][i])) {
                                newErrorArr = SPValuesArr[0][i];
                                retunedNewUnmached.push(newErrorArr);
                            }
                        }
                        if (retunedNewUnmached.length !== 0) {
                            throw new Error(`${retunedNewUnmached}`);
                        }
                        // but if there is no error just save them or him into database.
                        // @ts-ignore
                        const correctColumn = (_c = rows === null || rows === void 0 ? void 0 : rows.data) === null || _c === void 0 ? void 0 : _c.values[0];
                        const indexes = getIndexArrOfTheTrainee(correctColumn);
                        const traineeArray = giveMeDataInACorrectFormatTrainee((_d = rows === null || rows === void 0 ? void 0 : rows.data) === null || _d === void 0 ? void 0 : _d.values, correctColumn, indexes);
                        const attributesArray = giveMeDataInACorrectFormatAttributes((_e = rows === null || rows === void 0 ? void 0 : rows.data) === null || _e === void 0 ? void 0 : _e.values, correctColumn);
                        for (let i = 0; i < ((_g = (_f = rows.data) === null || _f === void 0 ? void 0 : _f.values) === null || _g === void 0 ? void 0 : _g.length) - 1; i++) {
                            const cycle = yield applicationCycle_1.applicationCycle.findOne({
                                name: attributesArray[i].cycle_id,
                            });
                            if (!cycle) {
                                throw new Error("Wrong cycle name is provided!!!!");
                            }
                            const trainee = new traineeApplicant_1.default(Object.assign(Object.assign({}, traineeArray[i]), { cycle_id: cycle === null || cycle === void 0 ? void 0 : cycle._id }));
                            yield trainee.save();
                            const traineeAttributeObj = Object.assign(Object.assign({}, attributesArray[i].attributes), { trainee_id: trainee._id });
                            const traineeAttributes = new traineeAttribute_1.traineEAttributes(traineeAttributeObj);
                            yield traineeAttributes.save();
                        }
                    }
                    return "Trainees data loaded to db successfully";
                }
                catch (error) {
                    return error;
                }
            });
        },
        reSendDataIntoDb(_parent, _args) {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function* () {
                const auth = new googleapis_1.google.auth.GoogleAuth({
                    keyFile: "credentials.json",
                    scopes: "https://www.googleapis.com/auth/spreadsheets",
                });
                //create client instance for auth
                const client = yield auth.getClient();
                //instance of google sheets API
                const googleSheets = googleapis_1.google.sheets({
                    version: "v4",
                    auth: client,
                });
                //read rows from spreadsheet
                const spreadsheetId = _args.columnData.spreadsheetId;
                const rows = yield googleSheets.spreadsheets.values.get({
                    auth,
                    spreadsheetId,
                    range: "Sheet1",
                });
                const { columnData } = _args;
                const arrOfProperty = Object.keys(columnData);
                const arrOfValues = Object.values(columnData);
                const replaceToGetCorrectColumn = (firstRowColumnArr) => {
                    for (let i = 0; i < firstRowColumnArr.length; i++) {
                        // @ts-ignore
                        if (firstRowColumnArr.includes(arrOfValues[i])) {
                            // @ts-ignore
                            const index = firstRowColumnArr.indexOf(arrOfValues[i]);
                            firstRowColumnArr.splice(index, 1, arrOfProperty[i]);
                        }
                    }
                    return firstRowColumnArr;
                };
                const getIndexArrOfTheTrainee = (correctColumnOfProperty) => {
                    const arrayOfTraineeProperties = ["firstName", "lastName", "email"];
                    const traineeIndexArray = [];
                    for (let i = 0; i < arrayOfTraineeProperties.length; i++) {
                        // @ts-ignore
                        if (correctColumnOfProperty.includes(arrayOfTraineeProperties[i])) {
                            // @ts-ignore
                            const index = correctColumnOfProperty.indexOf(arrayOfTraineeProperties[i]);
                            traineeIndexArray.push(index);
                        }
                    }
                    return traineeIndexArray;
                };
                const giveMeDataInACorrectFormatTrainee = (arrOfAllRows, correctColumnArr, arrOfTraineeIndexes) => {
                    // [1,8,12]
                    const arrOfObject = [];
                    for (let i = 1; i < arrOfAllRows.length; i++) {
                        arrOfObject.push({
                            [correctColumnArr[arrOfTraineeIndexes[0]]]: arrOfAllRows[i][arrOfTraineeIndexes[0]],
                            [correctColumnArr[arrOfTraineeIndexes[1]]]: arrOfAllRows[i][arrOfTraineeIndexes[1]],
                            [correctColumnArr[arrOfTraineeIndexes[2]]]: arrOfAllRows[i][arrOfTraineeIndexes[2]],
                        });
                    }
                    return arrOfObject;
                };
                // [arr[0][3]]
                const replaceNoOrYesWithTrueOrFalseFunc = (dataObject) => {
                    let finObject = Object.assign({}, dataObject);
                    if (dataObject.isEmployed.toLowerCase() === "no") {
                        finObject = Object.assign(Object.assign({}, finObject), { isEmployed: false });
                    }
                    if (dataObject.haveLaptop.toLowerCase() === "no") {
                        finObject = Object.assign(Object.assign({}, finObject), { haveLaptop: false });
                    }
                    if (dataObject.isStudent.toLowerCase() === "no") {
                        finObject = Object.assign(Object.assign({}, finObject), { isStudent: false });
                    }
                    if (dataObject.isStudent.toLowerCase() === "yes") {
                        finObject = Object.assign(Object.assign({}, finObject), { isStudent: true });
                    }
                    if (dataObject.haveLaptop.toLowerCase() === "yes") {
                        finObject = Object.assign(Object.assign({}, finObject), { haveLaptop: true });
                    }
                    if (dataObject.isEmployed.toLowerCase() === "yes") {
                        finObject = Object.assign(Object.assign({}, finObject), { isEmployed: true });
                    }
                    return finObject;
                };
                const giveMeDataInACorrectFormatAttributes = (arr, arrOfCorrectColumnProperties) => {
                    const arrOfObject = [];
                    for (let i = 1; i < arr.length; i++) {
                        arrOfObject.push({
                            [arrOfCorrectColumnProperties[3]]: arr[i][3],
                            [arrOfCorrectColumnProperties[4]]: arr[i][4],
                            [arrOfCorrectColumnProperties[5]]: arr[i][5],
                            [arrOfCorrectColumnProperties[6]]: arr[i][6],
                            [arrOfCorrectColumnProperties[7]]: arr[i][7],
                            [arrOfCorrectColumnProperties[8]]: arr[i][8],
                            [arrOfCorrectColumnProperties[9]]: arr[i][9],
                            [arrOfCorrectColumnProperties[10]]: arr[i][10],
                            [arrOfCorrectColumnProperties[11]]: arr[i][11],
                            [arrOfCorrectColumnProperties[12]]: arr[i][12],
                            [arrOfCorrectColumnProperties[13]]: arr[i][13],
                            [arrOfCorrectColumnProperties[14]]: arr[i][14],
                            [arrOfCorrectColumnProperties[15]]: arr[i][15],
                            [arrOfCorrectColumnProperties[16]]: arr[i][16],
                            [arrOfCorrectColumnProperties[17]]: arr[i][17],
                            [arrOfCorrectColumnProperties[18]]: arr[i][18],
                            [arrOfCorrectColumnProperties[19]]: arr[i][19],
                            [arrOfCorrectColumnProperties[20]]: arr[i][20],
                            [arrOfCorrectColumnProperties[0]]: arr[i][0],
                            [arrOfCorrectColumnProperties[1]]: arr[i][1],
                            [arrOfCorrectColumnProperties[2]]: arr[i][2],
                        });
                    }
                    const arrOfAttributesData = arrOfObject.map((item) => {
                        delete item["firstName"];
                        delete item["lastName"];
                        delete item["email"];
                        let cycle_id = "";
                        if (columnData["cycle_name"] === "") {
                            cycle_id = item["cycle_name"];
                        }
                        else {
                            cycle_id = columnData["cycle_name"];
                        }
                        delete item["cycle_name"];
                        const attributesObject = replaceNoOrYesWithTrueOrFalseFunc(item);
                        return {
                            attributes: attributesObject,
                            cycle_id: cycle_id,
                        };
                    });
                    return arrOfAttributesData;
                };
                // @ts-ignore
                const correctColumn = replaceToGetCorrectColumn((_a = rows === null || rows === void 0 ? void 0 : rows.data) === null || _a === void 0 ? void 0 : _a.values[0]);
                const indexes = getIndexArrOfTheTrainee(correctColumn);
                const traineeArray = giveMeDataInACorrectFormatTrainee((_b = rows === null || rows === void 0 ? void 0 : rows.data) === null || _b === void 0 ? void 0 : _b.values, correctColumn, indexes);
                const attributesArray = giveMeDataInACorrectFormatAttributes((_c = rows === null || rows === void 0 ? void 0 : rows.data) === null || _c === void 0 ? void 0 : _c.values, correctColumn);
                // save the trainee to the database
                // @ts-ignore
                for (let i = 0; i < ((_e = (_d = rows.data) === null || _d === void 0 ? void 0 : _d.values) === null || _e === void 0 ? void 0 : _e.length) - 1; i++) {
                    const cycle = yield applicationCycle_1.applicationCycle.findOne({ name: attributesArray[i].cycle_id });
                    if (!cycle) {
                        throw new Error("Wrong cycle name is provided!!!!");
                    }
                    const trainee = new traineeApplicant_1.default(Object.assign(Object.assign({}, traineeArray[i]), { cycle_id: cycle === null || cycle === void 0 ? void 0 : cycle._id }));
                    yield trainee.save();
                    const traineeAttributeObj = Object.assign(Object.assign({}, attributesArray[i].attributes), { trainee_id: trainee._id });
                    const traineeAttributes = new traineeAttribute_1.traineEAttributes(traineeAttributeObj);
                    yield traineeAttributes.save();
                }
                return "The data mapped has been saved successfully, CONGRATS";
            });
        },
    },
};
exports.default = loadTraineeResolver;
