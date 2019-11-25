import { Express } from 'express';
import Server from 'next/dist/next-server/server/next-server';

export default function configureRouts(app: Server, server: Express) {
  
  // Create request handler
  const handle = app.getRequestHandler();
  
  // Handle all Next.js routes
  server.get('*', (req, res) => {
    return handle(req, res);
  });
}
