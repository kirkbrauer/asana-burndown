import { createConnection, Connection } from 'typeorm';
// Import entities
import User from './entities/User';
// Export the database connection
export let connection: Connection;

export default async function connectToDatabase() {
  connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    entities: [User]
  });
  return connection;
}
