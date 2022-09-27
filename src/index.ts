import { ApolloServer, gql } from "apollo-server"
import { connect } from "./database/db.config"
import { resolvers } from "./resolvers/userResolver";
import { typeDefs } from "./schema";

const PORT = process.env.PORT || 4001

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

connect().then(() => {
  console.log("Database connected!")
  server.listen(PORT).then(({ url }) => console.info(`App on ${url}`))
})
