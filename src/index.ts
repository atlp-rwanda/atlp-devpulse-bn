import { ApolloServer } from "apollo-server";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { connect } from "./database/db.config";
import { typeDefsTrainee } from "./schema/traineeApplicantSchema";
import { typeDefsAttribute } from "./schema/traineeAttributeSchema";
import { traineeApplicantResolver } from "./resolvers/traineeApplicantResolver";
import { traineeAttributeResolver } from "./resolvers/traineeAttributeResolver";
import deleteTraineTypeDefs from "./schema/deleteTraineTypeDefs";
import traineeResolvers from "./resolvers/DelTranee";
import filterTraineeResolver from "./resolvers/filterTraineeResolver";
import { filterTraineetypeDefs } from "./schema/filterTraineeTypeDefs";
import { recyclebinresolver } from "./resolvers/emptyrecycle";
import recyclebinempty from "./schema/recyclebin";
import scoreTypesSchema from "./schema/scoreTypesSchema";
import scoreValueSchema from "./schema/scoreValueSchema";
import applicationCycleResolver from "./resolvers/applicationCycleResolver";
import applicationCycleTypeDefs from "./schema/applicationCycleTypeDefs";
import { usersResolvers } from "./resolvers/userResolver";
import { updateUserTypeDefs } from "./schema/updateUserTypeDefs";
import loadTraineeResolver from "./resolvers/traineeResolvers";
import loadAllTraineesFromGoogleSheet from "./schema/loadAllTraineesFromGoogleSheet";
import ResendDataSchema from "./schema/resendDataIntoDbTypeDefs";
import scoreTypeResolver from "./resolvers/scoreTypesResolvers";
import scoreValuesResolver from "./resolvers/scoreValuesResolvers";
import { ApolloServerPluginInlineTrace } from "apollo-server-core";
import { findOrCreateUser } from "./utils/controllers/userController";
import { LoggedUserSchema } from "./schema/loggedUser";
import { loggedUserResolvers } from "./resolvers/loginUserResolver";
import sendBulkyEmailResolver from "./resolvers/bulkyEmailResolver";
import sendBulkyEmailTypeDefs from "./schema/bulkyEmailTypeDefs";
import {roleSchema} from "./schema/roleTypedefs";
import { roleResolvers } from "./resolvers/roleResolver";
import { permissionResolvers } from "./resolvers/permissionResolver";
import { permissionSchemaTypeDef } from "./schema/permissionTypeSchema";
import { newApplicationResolver } from "./resolvers/newApplications";
import newApplicant from './schema/newApplications'
import { formatError } from "./validations/customeError";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const configPath = path.join(__dirname,'..', 'credentials.json');
const configFileContent = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configFileContent);

config.web.client_id = process.env.CLIENT_ID;
config.web.client_secret = process.env.CLIENT_SECRET;
config.web.project_id = process.env.PROJECT_ID;

// const PORT = process.env.PORT || 4001;

const resolvers = mergeResolvers([
  applicationCycleResolver,
  usersResolvers,
  traineeAttributeResolver,
  traineeApplicantResolver,
  traineeResolvers,
  filterTraineeResolver,
  recyclebinresolver,
  loadTraineeResolver,
  scoreTypeResolver,
  scoreValuesResolver,
  loggedUserResolvers,
  sendBulkyEmailResolver,
  roleResolvers,
  permissionResolvers,
  newApplicationResolver
]);
const typeDefs = mergeTypeDefs([
  applicationCycleTypeDefs,
  typeDefsAttribute,
  typeDefsTrainee,
  updateUserTypeDefs,
  deleteTraineTypeDefs,
  filterTraineetypeDefs,
  recyclebinempty,
  loadAllTraineesFromGoogleSheet,
  scoreTypesSchema,
  scoreValueSchema,
  ResendDataSchema,
  LoggedUserSchema,
  sendBulkyEmailTypeDefs,
  roleSchema,
  permissionSchemaTypeDef,
  newApplicant
]);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        //find or create User
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (error) {
      console.error(`Unable to authenticate user with token ${authToken}`);
    }
    return { currentUser };
  },
  introspection: true,
  csrfPrevention: true,
  plugins: [ApolloServerPluginInlineTrace()],
  // cache: "bounded",
});

connect().then(() => {
  console.log("Database connected!");
  server.listen(PORT).then(({ url }) => console.info(`App on ${url}`));
});
