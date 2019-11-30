import { createConnection, getConnection } from 'typeorm';
// Import entities
import User from './entities/User';
import Burndown from './entities/Burndown';
import Task from './entities/Task';

export default async function connectToDatabase() {
  return createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
    entities: [
      User,
      Burndown,
      Task
    ]
  });
}
