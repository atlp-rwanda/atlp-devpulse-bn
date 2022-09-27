import { ApolloServer, gql } from "apollo-server"
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { connect } from "./database/db.config"
import applicationCycleResolver from "./resolvers/applicationCycleResolver"
import applicationCycleTypeDefs from './schema/applicationCycleTypeDefs'

const PORT = process.env.PORT || 4001;

const resolvers = mergeResolvers([applicationCycleResolver])
const typeDefs= mergeTypeDefs([applicationCycleTypeDefs])
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  csrfPrevention: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault],
  cache: 'bounded',
})

connect().then(() => {
  console.log("Database connected!");
  server.listen(PORT).then(({ url }) => console.info(`App on ${url}`));
});
