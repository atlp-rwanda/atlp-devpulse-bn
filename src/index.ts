import { ApolloServer, gql } from "apollo-server"
import { connect } from "./database/db.config"

const PORT = process.env.PORT || 4001

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => "Yooo this is your GraphQL server! Do what you want with it",
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

connect().then(() => {
  console.log("Database connected!")
  server.listen(PORT).then(({ url }) => console.info(`App on ${url}`))
})
