import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';

// Import resolvers
import resolvers from './resolvers';

// Import the GraphQL schema
const typeDefs = importSchema(`${__dirname}/../schema.graphql`);

export default function configureApolloServer(app: Express) {
  // Create the apollo server
  const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    introspection: true,
    context: ({ req }) => ({
      getUser: () => req.user,
      logout: () => req.logout(),
    }),
    playground: process.env.NODE_ENV !== 'production' && {
      settings: {
        'request.credentials': 'same-origin',
      },
    },
  });

  // Connect the apollo server to the express app
  apolloServer.applyMiddleware({ 
    app
  });
}
