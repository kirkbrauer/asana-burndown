import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import { Client } from 'asana';
import User from './entities/User';
import createAsanaClient from './asanaClient';

// Import resolvers
import resolvers from './resolvers';

// Import the GraphQL schema
const typeDefs = importSchema(`${__dirname}/../schema.graphql`);

export type ContextType = {
  getUser: () => User,
  logout: () => void,
  getClient: () => Promise<Client>
};

export default function configureApolloServer(app: Express) {
  // Create the apollo server
  const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    introspection: true,
    context: ({ req }) => ({
      getUser: () => req.user,
      logout: () => req.logout(),
      getClient: () => createAsanaClient(req.user as User)
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
