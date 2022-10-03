import { ApolloServer } from "apollo-server";
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { connect } from "./database/db.config"
import { typeDefsTrainee } from "./schema/traineeApplicantSchema";
import { typeDefsAttribute } from "./schema/traineeAttributeSchema";
import { traineeApplicantResolver } from "./resolvers/traineeApplicantResolver";
import { traineeAttributeResolver } from "./resolvers/traineeAttributeResolver";




import applicationCycleResolver from "./resolvers/applicationCycleResolver"
import applicationCycleTypeDefs from './schema/applicationCycleTypeDefs'
import  {usersResolvers}  from "./resolvers/userResolver";
import { updateUserTypeDefs } from "./schema/updateUserTypeDefs";


const PORT = process.env.PORT || 4001;

const resolvers = mergeResolvers([applicationCycleResolver, usersResolvers,traineeAttributeResolver, traineeApplicantResolver])
const typeDefs= mergeTypeDefs([applicationCycleTypeDefs, typeDefsAttribute, typeDefsTrainee, updateUserTypeDefs])

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  csrfPrevention: true,
  cache: 'bounded',


// import { ApolloServer } from "apollo-server"
// import { connect } from "./database/db.config"
// import { resolvers } from "./resolvers/userResolver";
// import { typeDefs } from "./typeDefs";
// const PORT = process.env.PORT || 4001
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   csrfPrevention: true, // highly recommended
//   cache: "bounded",
//   introspection: true
})

connect().then(() => {
  console.log("Database connected!");
  server.listen(PORT).then(({ url }) => console.info(`App on ${url}`));
});
