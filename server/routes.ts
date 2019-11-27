import { Express } from 'express';
import Server from 'next/dist/next-server/server/next-server';
import { checkAuth } from './auth';

export default function configureRoutes(app: Server, server: Express) {
  
  // Create request handler
  const handle = app.getRequestHandler();

  server.get('/login', (req, res) => {
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

  server.get('/w/:workspaceId', checkAuth, (req, res) => {
    app.render(req, res, '/projects', { workspaceId: req.params.workspaceId });
  });
  
  // Handle all Next.js routes
  server.get('*', (req, res) => {
    return handle(req, res);
  });
}
