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
const apollo_server_core_1 = require("apollo-server-core");
const userController_1 = require("./utils/controllers/userController");
const loggedUser_1 = require("./schema/loggedUser");
const loginUserResolver_1 = require("./resolvers/loginUserResolver");
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
    loginUserResolver_1.loggedUserResolvers,
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
    loggedUser_1.LoggedUserSchema,
]);
const server = new apollo_server_1.ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = req.headers.authorization;
            if (authToken) {
                //find or create User
                currentUser = yield (0, userController_1.findOrCreateUser)(authToken);
            }
        }
        catch (error) {
            console.error(`Unable to authenticate user with token ${authToken}`);
        }
        return { currentUser };
    }),
    introspection: true,
    csrfPrevention: true,
    plugins: [(0, apollo_server_core_1.ApolloServerPluginInlineTrace)()],
    // cache: "bounded",
});
(0, db_config_1.connect)().then(() => {
    console.log("Database connected!");
    server.listen(PORT).then(({ url }) => console.info(`App on ${url}`));
});
