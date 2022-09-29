import { ApolloServer, gql } from "apollo-server";
import { connect } from "./database/db.config";
import loadTraineeResolver from "./resolvers/traineeResolvers";
import { mergeResolvers } from "@graphql-tools/merge";
import typeDefs from "./schema/index";

const PORT = process.env.PORT || 4001;

// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

const resolvers = mergeResolvers([loadTraineeResolver]);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

connect().then(() => {
  console.log("Database connected!");
  server.listen(PORT).then(({ url }) => console.info(`App on ${url}`));
});
