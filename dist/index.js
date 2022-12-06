"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const merge_1 = require("@graphql-tools/merge");
const db_config_1 = require("./database/db.config");
const traineeApplicantSchema_1 = require("./schema/traineeApplicantSchema");
const traineeAttributeSchema_1 = require("./schema/traineeAttributeSchema");
const traineeApplicantResolver_1 = require("./resolvers/traineeApplicantResolver");
const traineeAttributeResolver_1 = require("./resolvers/traineeAttributeResolver");
const deleteTraineTypeDefs_1 = __importDefault(require("./schema/deleteTraineTypeDefs"));
const DelTranee_1 = __importDefault(require("./resolvers/DelTranee"));
const filterTraineeResolver_1 = __importDefault(require("./resolvers/filterTraineeResolver"));
const filterTraineeTypeDefs_1 = require("./schema/filterTraineeTypeDefs");
const emptyrecycle_1 = require("./resolvers/emptyrecycle");
const recyclebin_1 = __importDefault(require("./schema/recyclebin"));
const scoreTypesSchema_1 = __importDefault(require("./schema/scoreTypesSchema"));
const scoreValueSchema_1 = __importDefault(require("./schema/scoreValueSchema"));
const applicationCycleResolver_1 = __importDefault(require("./resolvers/applicationCycleResolver"));
const applicationCycleTypeDefs_1 = __importDefault(require("./schema/applicationCycleTypeDefs"));
const userResolver_1 = require("./resolvers/userResolver");
const updateUserTypeDefs_1 = require("./schema/updateUserTypeDefs");
const traineeResolvers_1 = __importDefault(require("./resolvers/traineeResolvers"));
const loadAllTraineesFromGoogleSheet_1 = __importDefault(require("./schema/loadAllTraineesFromGoogleSheet"));
const resendDataIntoDbTypeDefs_1 = __importDefault(require("./schema/resendDataIntoDbTypeDefs"));
const scoreTypesResolvers_1 = __importDefault(require("./resolvers/scoreTypesResolvers"));
const scoreValuesResolvers_1 = __importDefault(require("./resolvers/scoreValuesResolvers"));
const PORT = process.env.PORT || 3000;
// const PORT = process.env.PORT || 4001;
const resolvers = (0, merge_1.mergeResolvers)([
    applicationCycleResolver_1.default,
    userResolver_1.usersResolvers,
    traineeAttributeResolver_1.traineeAttributeResolver,
    traineeApplicantResolver_1.traineeApplicantResolver,
    DelTranee_1.default,
    filterTraineeResolver_1.default,
    emptyrecycle_1.recyclebinresolver,
    traineeResolvers_1.default,
    scoreTypesResolvers_1.default,
    scoreValuesResolvers_1.default,
]);
const typeDefs = (0, merge_1.mergeTypeDefs)([
    applicationCycleTypeDefs_1.default,
    traineeAttributeSchema_1.typeDefsAttribute,
    traineeApplicantSchema_1.typeDefsTrainee,
    updateUserTypeDefs_1.updateUserTypeDefs,
    deleteTraineTypeDefs_1.default,
    filterTraineeTypeDefs_1.filterTraineetypeDefs,
    recyclebin_1.default,
    loadAllTraineesFromGoogleSheet_1.default,
    scoreTypesSchema_1.default,
    scoreValueSchema_1.default,
    resendDataIntoDbTypeDefs_1.default,
]);
const server = new apollo_server_1.ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    csrfPrevention: true,
    // cache: "bounded",
});
(0, db_config_1.connect)().then(() => {
    console.log("Database connected!");
    server.listen(PORT).then(({ url }) => console.info(`App on ${url}`));
});
