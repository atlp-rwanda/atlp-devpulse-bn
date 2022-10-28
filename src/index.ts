import { ApolloServer } from "apollo-server";
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { connect } from "./database/db.config"
import { typeDefsTrainee } from "./schema/traineeApplicantSchema";
import { typeDefsAttribute } from "./schema/traineeAttributeSchema";
import { traineeApplicantResolver } from "./resolvers/traineeApplicantResolver";
import { traineeAttributeResolver } from "./resolvers/traineeAttributeResolver";
import deleteTraineTypeDefs from '../src/schema/deleteTraineTypeDefs'
import traineeResolvers from "./resolvers/DelTranee"
import filterTraineeResolver from "./resolvers/filterTraineeResolver";
import { filterTraineetypeDefs } from "./schema/filterTraineeTypeDefs"
import { recyclebinresolver} from "./resolvers/emptyrecycle";
import recyclebinempty from "./schema/recyclebin";

import applicationCycleResolver from "./resolvers/applicationCycleResolver"
import applicationCycleTypeDefs from './schema/applicationCycleTypeDefs'
import  {usersResolvers}  from "./resolvers/userResolver";
import { updateUserTypeDefs } from "./schema/updateUserTypeDefs";
import loadTraineeResolver from "./resolvers/traineeResolvers";
import loadAllTraineesFromGoogleSheet from "./schema/loadAllTraineesFromGoogleSheet"


const PORT = process.env.PORT || 4001;

const resolvers = mergeResolvers([applicationCycleResolver, usersResolvers,traineeAttributeResolver, traineeApplicantResolver,traineeResolvers, filterTraineeResolver,recyclebinresolver,loadTraineeResolver])
const typeDefs= mergeTypeDefs([applicationCycleTypeDefs, typeDefsAttribute, typeDefsTrainee, updateUserTypeDefs, deleteTraineTypeDefs,filterTraineetypeDefs,recyclebinempty,loadAllTraineesFromGoogleSheet])

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  csrfPrevention: true,
  cache: 'bounded',
})

connect().then(() => {
  console.log("Database connected!");
  server.listen(PORT).then(({ url }) => console.info(`App on ${url}`));
});
