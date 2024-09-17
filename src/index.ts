import { ApolloServer } from "apollo-server";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { connect } from "./database/db.config.js";
import { typeDefsTrainee } from "./schema/traineeApplicantSchema.js";
import { typeDefsAttribute } from "./schema/traineeAttributeSchema.js";
import { traineeApplicantResolver } from "./resolvers/traineeApplicantResolver.js";
import { traineeAttributeResolver } from "./resolvers/traineeAttributeResolver.js";
import deleteTraineTypeDefs from "./schema/deleteTraineTypeDefs.js";
import traineeResolvers from "./resolvers/DelTranee.js";
import filterTraineeResolver from "./resolvers/filterTraineeResolver.js";
import { filterTraineetypeDefs } from "./schema/filterTraineeTypeDefs.js";
import { recyclebinresolver } from "./resolvers/emptyrecycle.js";
import recyclebinempty from "./schema/recyclebin.js";
import scoreTypesSchema from "./schema/scoreTypesSchema.js";
import scoreValueSchema from "./schema/scoreValueSchema.js";
import applicationCycleResolver from "./resolvers/applicationCycleResolver.js";
import applicationCycleTypeDefs from "./schema/applicationCycleTypeDefs.js";
import { usersResolvers } from "./resolvers/userResolver.js";
import { updateUserTypeDefs } from "./schema/updateUserTypeDefs.js";
import loadTraineeResolver from "./resolvers/traineeResolvers.js";
import loadAllTraineesFromGoogleSheet from "./schema/loadAllTraineesFromGoogleSheet.js";
import ResendDataSchema from "./schema/resendDataIntoDbTypeDefs.js";
import scoreTypeResolver from "./resolvers/scoreTypesResolvers.js";
import scoreValuesResolver from "./resolvers/scoreValuesResolvers.js";
import { ApolloServerPluginInlineTrace } from "apollo-server-core";
import { findOrCreateUser } from "./utils/controllers/userController.js";
import candidateApplicationResolver from "./resolvers/candidateApplicationResolver.js";
import { LoggedUserSchema } from "./schema/loggedUser.js";
import { loggedUserResolvers } from "./resolvers/loginUserResolver.js";
import sendBulkyEmailResolver from "./resolvers/bulkyEmailResolver.js";
import sendBulkyEmailTypeDefs from "./schema/bulkyEmailTypeDefs.js";
import {roleSchema} from "./schema/roleTypedefs.js";
import { roleResolvers } from "./resolvers/roleResolver.js";
import { permissionResolvers } from "./resolvers/permissionResolver.js";
import { permissionSchemaTypeDef } from "./schema/permissionTypeSchema.js";
import candidateApplication from "./schema/candidateApplication.js";
import userLoginSchema from "./schema/userLoginSchema.js";
import { formSchema } from "./schema/formSchema.js";
import { formsResolver } from "./resolvers/forms.resolver.js";
import { formatError } from "./utils/customErrorHandler.js";
import { formJobSchema } from "./schema/formJobSchema.js";
import { jobPostResolver } from  "./resolvers/jobPostResolvers.js"
import { programTypeDefs } from "./schema/programSchema.js";
import { programResolvers } from "./resolvers/programResolver.js";
import { cohortSchema } from "./schema/cohortScheme.js";
import { cohortResolver } from "./resolvers/cohortResolver.js";
import { viewOwnApplicationTypeDefs }  from "./schema/viewOwnApplication.js";
import candidateViewOwnApplication from "./resolvers/viewOwnApplicationResolver.js";
import { gradingTypeDefs } from "./schema/gradingSchema.js";
import gradingResolver from "./resolvers/grading.js";
import {adminViewApplicationsResolvers }from "./resolvers/adminViewApplications.js";
import { adminViewAllApplicationsTypedefs} from "./schema/adminViewApplicationsSchema.js";
import "dotenv/config"

const PORT = process.env.PORT || 3000;

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
  formsResolver,
  jobPostResolver,
  programResolvers,
  candidateApplicationResolver,
  cohortResolver,
  candidateViewOwnApplication,
  gradingResolver,
  adminViewApplicationsResolvers,
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
  userLoginSchema,
  formSchema,
  formJobSchema,
  programTypeDefs,
  candidateApplication,
  cohortSchema,
  viewOwnApplicationTypeDefs,
  gradingTypeDefs,
  adminViewAllApplicationsTypedefs,
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
});

connect().then(() => {
  console.log("Database connected!");
  server.listen(PORT).then(({ url }) =>   console.info(`App on ${url}`));
});
