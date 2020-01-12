import { Express } from 'express';
import Server from 'next/dist/next-server/server/next-server';
import { checkAuth } from './auth';

export default function configureRoutes(app: Server, server: Express) {
  
  // Create request handler
  const handle = app.getRequestHandler();

  server.get('/login', (req, res) => {
    // Login redirect for users
    if (req.user) {
      res.redirect('/');
    } else {
      app.render(req, res, '/login');
    }
  });

  server.get('/', checkAuth, (req, res) => {
    // Automatically redirect to the correct workspace
    if (req.cookies.workspaceId) {
      res.redirect(`/w/${req.cookies.workspaceId}`);
    } else {
      app.render(req, res, '/');
    }
  });
  
  // Handle all Next.js routes
  server.get('*', checkAuth, (req, res) => {
    return handle(req, res);
  });
}
