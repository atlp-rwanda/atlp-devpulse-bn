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
import { findOrCreateUser } from "./utils/controllers/userController";
import candidateApplicationResolver from "./resolvers/candidateApplicationResolver";
import { LoggedUserSchema } from "./schema/loggedUser";
import { loggedUserResolvers } from "./resolvers/loginUserResolver";
import sendBulkyEmailResolver from "./resolvers/bulkyEmailResolver";
import sendBulkyEmailTypeDefs from "./schema/bulkyEmailTypeDefs";
import {roleSchema} from "./schema/roleTypedefs";
import { roleResolvers } from "./resolvers/roleResolver";
import { permissionResolvers } from "./resolvers/permissionResolver";
import { permissionSchemaTypeDef } from "./schema/permissionTypeSchema";
import candidateApplication from "./schema/candidateApplication";
import userLoginSchema from "./schema/userLoginSchema";
import { formSchema } from "./schema/formSchema";
import { formsResolver } from "./resolvers/forms.resolver";
import { formatError } from "./utils/customErrorHandler";
import { formJobSchema } from "./schema/formJobSchema";
import { jobPostResolver } from  "./resolvers/jobPostResolvers"
import { programTypeDefs } from "./schema/programSchema";
import { programResolvers } from "./resolvers/programResolver";
import { cohortSchema } from "./schema/cohortScheme";
import { cohortResolver } from "./resolvers/cohortResolver";
import { viewOwnApplicationTypeDefs }  from "./schema/viewOwnApplication";
import candidateViewOwnApplication from "./resolvers/viewOwnApplicationResolver";
import { gradingTypeDefs } from "./schema/gradingSchema";
import gradingResolver from "./resolvers/grading";
import {adminViewApplicationsResolvers }from "./resolvers/adminViewApplications";
import { adminViewAllApplicationsTypedefs} from "./schema/adminViewApplicationsSchema";
import { attendanceResolver } from "./resolvers/attendanceResolver";
import { attendanceSchema } from "./schema/attendanceSchema";
import { performanceResolver } from "./resolvers/performanceResolver";
import { performanceSchema } from "./schema/performanceSchema";

import filterJobResolver from "./resolvers/filterJob";
import filterProgramResolver from "./resolvers/filterPrograms";
import filterRoleResolver from "./resolvers/filterRole";

// import {forgetPassword } from "./resolvers/forgetpassword";
import { passwordResolvers } from './resolvers/forgetpassword';
import { passwordSchema } from "./schema/forgetpassword";

import { SearchSchema } from "./schema/searchSchema";
import { searchResolver } from "./resolvers/searchResolver";
import {appliedJobResolver} from "./resolvers/appliedJobResolver";
import { appliedJobTypeDefs } from "./schema/appliedJobTypeDefs";

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
  attendanceResolver,
  performanceResolver,
  filterJobResolver,
  filterProgramResolver,
  filterRoleResolver,
  passwordResolvers,
  searchResolver,
  appliedJobResolver,

]);
const typeDefs = mergeTypeDefs([
  applicationCycleTypeDefs,
  typeDefsAttribute,
  typeDefsTrainee,
  updateUserTypeDefs,
  passwordSchema,
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
  SearchSchema,
  appliedJobTypeDefs,
  performanceSchema,
  attendanceSchema
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
      
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (error) {
      console.error(`Unable to authenticate user`);
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
