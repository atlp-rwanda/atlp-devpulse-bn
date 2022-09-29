import { ApolloServer } from "apollo-server";
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { connect } from "./database/db.config"
import { typeDefsTrainee } from "./schema/traineeApplicantSchema";
import { typeDefsCollection } from "./schema/traineeCollectionSchema";
import { traineeApplicantResolver } from "./resolvers/traineeApplicantResolver";
import { traineeCollectionResolver } from "./resolvers/traineeCollectionResolver";

const resolvers = mergeResolvers([traineeCollectionResolver, traineeApplicantResolver]);
const typeDefs = mergeTypeDefs([typeDefsCollection, typeDefsTrainee])


const PORT = process.env.PORT || 4001

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

connect().then(() => {
  console.log("Database connected!")
  server.listen(PORT).then(({ url }) => console.info(`App on ${url}`))
})
