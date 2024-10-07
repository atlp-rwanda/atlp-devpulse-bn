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
import filterJobResolver from "./resolvers/filterJob";
import filterProgramResolver from "./resolvers/filterPrograms";
import filterRoleResolver from "./resolvers/filterRole";
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
  filterJobResolver,
  filterProgramResolver,
  filterRoleResolver,
  appliedJobResolver
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
  appliedJobTypeDefs
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
