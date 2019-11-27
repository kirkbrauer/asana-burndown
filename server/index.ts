import next from 'next';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';

// Configure dotenv
dotenv.config();

// Declare dev mode constant
const dev = process.env.NODE_ENV !== 'production';

// Import server dependencies
import configurePassport from './auth';
import configureApolloServer from './apollo';
import configureRoutes from './routes';
import connectToDatabase from './db';
import redisClient from './redis';
import { asanaClientMiddleware } from './asanaClient';

// Create Next.js app and request handler
const app = next({ dev });

// Create the redis session store
const RedisStore = connectRedis(session);

// Prepare the Next.js app
app.prepare().then(async () => {
  // Create the express server
  const server = express();
  
  // Configure the session middleware
  server.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  // Use cookie parser middleware
  server.use(cookieParser());

  // Configure passport
  configurePassport(server);

  // Use the asana client middleware on the graphql endpoint
  server.use('/graphql', asanaClientMiddleware);

  // Configure apollo server
  configureApolloServer(server);

  // Configure custom Next.js routes
  configureRoutes(app, server);

  // Connect to the database
  await connectToDatabase();

  // Start the server
  server.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log(`Server ready on port ${process.env.PORT}`);
  });
});
