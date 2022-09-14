import {ApolloServer, gql} from 'apollo-server'

const typeDefs  = gql`
  type Query {
      hello: String
  }`

const resolvers = {
    Query: {
        hello: () => 'Yooo this is your GraphQL server! Do what you want with it'
    }
}

const server = new ApolloServer({
    typeDefs,resolvers
})

server.listen('4001')
  .then(
    ({url}) => console.info(`App on ${url}`)
  )