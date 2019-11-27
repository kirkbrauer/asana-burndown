import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import { Client } from 'asana';
import { EmailAddressResolver } from 'graphql-scalars';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';
import User from './entities/User';

// Import resolvers
import resolvers from './resolvers';

// Import the GraphQL schema
const typeDefs = importSchema(`${__dirname}/../schema.graphql`);

export type ContextType = {
  user: User,
  client: Client,
  logout: () => void
};

export default function configureApolloServer(app: Express) {
  // Create the apollo server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: {
      ...resolvers,
      EmailAddress: EmailAddressResolver,
      DateTime: GraphQLDateTime,
      Date: GraphQLDate
    },
    introspection: true,
    context: ({ req }) => ({
      user: req.user,
      client: (req as any).client,
      logout: () => req.logout()
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
