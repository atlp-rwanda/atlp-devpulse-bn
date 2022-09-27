import { ApolloServer } from "apollo-server"
import { connect } from "./database/db.config"
import { resolvers } from "./resolvers/userResolver";
import { typeDefs } from "./typeDefs";
const PORT = process.env.PORT || 4001
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true, // highly recommended
  cache: "bounded",
  introspection: true
})

connect().then(() => {
  console.log("Database connected!")
  server.listen(PORT).then(({ url }) => console.info(`App on ${url}`))
})
