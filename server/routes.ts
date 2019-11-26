import { Express } from 'express';
import Server from 'next/dist/next-server/server/next-server';

export default function configureRouts(app: Server, server: Express) {
  
  // Create request handler
  const handle = app.getRequestHandler();

  server.get('/', (req, res) => {
    // Automatically redirect to the correct workspace
    if (req.cookies.workspaceId) {
      res.redirect(`/w/${req.cookies.workspaceId}/projects`);
    } else {
      app.render(req, res, '/');
    }
  });

  server.get('/w/:workspaceId/projects', (req, res) => {
    app.render(req, res, '/projects', { workspaceId: req.params.workspaceId });
  });
  
  // Handle all Next.js routes
  server.get('*', (req, res) => {
    return handle(req, res);
  });
}
