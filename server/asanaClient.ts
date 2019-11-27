import asana, { Dispatcher } from 'asana';
import { User as UserEntity } from './entities/User';
import redisClient from './redis';
import refresh from 'passport-oauth2-refresh';
import { Workspace, Project, Task, User } from './graphql/types';
import { Request, Response, NextFunction } from 'express';

export function asanaClientMiddleware(req: Request, res: Response, next: NextFunction) {
  // Create a new asana client for the request
  createAsanaClient(req.user as UserEntity).then((client) => {
    // Set the asana client on the request
    (req as any).client = client;
    next();
  });
}

export async function createAsanaClient(user: UserEntity): Promise<asana.Client> {
  let token = await redisClient.get(`${user.id}-accessToken`);
  if (!token) {
    // Refresh the access token
    const accessToken = await new Promise<string>((resolve, reject) => {
      refresh.requestNewAccessToken('Asana', user.refreshToken, (err, accessToken) => {
        if (err) return reject(err);
        return resolve(accessToken);
      });
    });
    // Update the user's access token
    token = accessToken;
    const key = `${user.id}-accessToken`;
    await redisClient.set(key, accessToken);
    await redisClient.expire(key, 60 * 60);
  }
  const client = asana.Client.create({ 
    clientId: process.env.ASANA_CLIENT_ID, 
    clientSecret: process.env.ASANA_CLIENT_SECRET,
    defaultHeaders: {
      'Asana-Enable': 'string_ids'
    }
  }).useOauth({ 
    credentials: { 
      access_token: token, 
      refresh_token: user.refreshToken 
    } 
  });
  return client;
}

export function convertProject(project: asana.resources.Projects.Type): Project {
  return {
    id: project.gid,
    name: project.name,
    description: project.notes !== '' ? project.notes : null,
    color: project.color,
    status: project.current_status ? {
      text: project.current_status.text,
      color: project.current_status.color
    } : null,
    archived: project.archived,
    createdAt: project.created_at ? new Date(project.created_at) : null,
    modifiedAt: project.modified_at ? new Date(project.modified_at) : null,
    dueOn: (project as any).due_on,
    startOn: (project as any).start_on,
    tasks: {
      nodes: []
    },
    workspace: {
      id: project.workspace.gid,
      projects: {
        nodes: []
      },
      tasks: {
        nodes: []
      }
    }
  };
}

export function convertWorkspace(workspace: asana.resources.Workspaces.Type | asana.resources.Workspaces.ShortType): Workspace {
  return {
    id: workspace.gid,
    name: workspace.name,
    projects: {
      nodes: []
    },
    tasks: {
      nodes: []
    }
  };
}

export function convertTask(task: asana.resources.Tasks.Type): Task {
  const custom_field = task.custom_fields.find(field => (field.name === 'Story Points' && (field as any).number_value));
  return {
    id: task.gid,
    name: task.name,
    storyPoints: custom_field ? (custom_field as any).number_value ? (custom_field as any).number_value : 1 : 1,
    defaultPoints: custom_field ? (custom_field as any).number_value ? false : true : true,
    completed: task.completed,
    completedAt: task.completed_at ? new Date(task.completed_at) : null,
    dueOn: task.due_on ? new Date(task.due_on) : null,
    createdAt: task.created_at ? new Date(task.created_at) : null,
    modifiedAt: task.modified_at ? new Date(task.modified_at) : null
  };
}

export function convertUser(user: asana.resources.Users.Type): User & { photoUrls: any } {
  return {
    id: user.gid,
    email: user.email,
    name: user.name,
    photoUrls: user.photo,
    workspaces: {
      nodes: []
    }
  };
}
