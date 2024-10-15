import { ApolloServer } from "apollo-server-express";
import express from "express";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { connect } from "./database/db.config";
import "./utils/cronJob";
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
import { roleSchema } from "./schema/roleTypedefs";
import { roleResolvers } from "./resolvers/roleResolver";
import { permissionResolvers } from "./resolvers/permissionResolver";
import { permissionSchemaTypeDef } from "./schema/permissionTypeSchema";
import candidateApplication from "./schema/candidateApplication";
import userLoginSchema from "./schema/userLoginSchema";
import { formSchema } from "./schema/formSchema";
import { formsResolver } from "./resolvers/forms.resolver";
import { formatError } from "./utils/customErrorHandler";
import { formJobSchema } from "./schema/formJobSchema";
import { jobPostResolver } from "./resolvers/jobPostResolvers";
import { programTypeDefs } from "./schema/programSchema";
import { programResolvers } from "./resolvers/programResolver";
import { cohortSchema } from "./schema/cohortScheme";
import { cohortResolver } from "./resolvers/cohortResolver";
import { viewOwnApplicationTypeDefs } from "./schema/viewOwnApplication";
import candidateViewOwnApplication from "./resolvers/viewOwnApplicationResolver";
import { gradingTypeDefs } from "./schema/gradingSchema";
import gradingResolver from "./resolvers/grading";
import { notificationResolvers } from "./resolvers/Adminnotification";
import { notificationTypedefs } from "./schema/adminNotification";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { execute, subscribe } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core/dist/plugin/drainHttpServer";
import { adminViewApplicationsResolvers } from "./resolvers/adminViewApplications";
import { adminViewAllApplicationsTypedefs } from "./schema/adminViewApplicationsSchema";
import { attendanceResolver } from "./resolvers/attendanceResolver";
import { attendanceSchema } from "./schema/attendanceSchema";
import { performanceResolver } from "./resolvers/performanceResolver";
import { performanceSchema } from "./schema/performanceSchema";
import filterJobResolver from "./resolvers/filterJob";
import filterProgramResolver from "./resolvers/filterPrograms";
import filterRoleResolver from "./resolvers/filterRole";

import applicantNotificationResolver from "./resolvers/applicantNotifications";
import applicantNotifcationsTypedefs from "./schema/applicantNotifications";
// import {forgetPassword } from "./resolvers/forgetpassword";
import { passwordResolvers } from "./resolvers/forgetpassword";

import { passwordSchema } from "./schema/forgetpassword";
import { SearchSchema } from "./schema/searchSchema";
import { searchResolver } from "./resolvers/searchResolver";
import { appliedJobResolver } from "./resolvers/appliedJobResolver";
import { appliedJobTypeDefs } from "./schema/appliedJobTypeDefs";

const PORT = process.env.PORT || 3000;

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
  notificationResolvers,
  attendanceResolver,
  performanceResolver,
  filterJobResolver,
  filterProgramResolver,
  filterRoleResolver,
  applicantNotificationResolver,
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

  notificationTypedefs,
  applicantNotifcationsTypedefs,
  SearchSchema,
  appliedJobTypeDefs,
  performanceSchema,
  attendanceSchema,
]);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  formatError,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken =
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : req.headers.authorization;
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
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),

    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server is running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });

  useServer({ schema, execute, subscribe }, wsServer);
}

connect()
  .then(() => {
    console.log("Database connected!");
    startServer();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
