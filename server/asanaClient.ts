import asana from 'asana';
import { User as UserEntity } from './entities/User';
import redisClient from './redis';
import refresh from 'passport-oauth2-refresh';
import { Workspace, Project, Task, User } from './graphql/types';
import { Request, Response, NextFunction } from 'express';
import uuidv5 from 'uuid/v5';

const TASK_ID_NAMESPACE = process.env.TASK_ID_NAMESPACE;

export function asanaClientMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    // Create a new asana client for the request
    createAsanaClient(req.user as UserEntity).then((client) => {
      // Set the asana client on the request
      (req as any).client = client;
      next();
    });
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
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
      totalCount: 0,
      totalPoints: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false
      }
    },
    workspace: {
      id: project.workspace.gid,
      projects: {
        nodes: [],
        pageInfo: {
          hasNextPage: false,
          nextPage: ''
        }
      }
    },
    burndowns: {
      totalCount: 0,
      edges: [],
      pageInfo: {
        startCursor: '',
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false
      }
    },
    burndown: null
  };
}

export function convertWorkspace(workspace: asana.resources.Workspaces.Type | asana.resources.Workspaces.ShortType): Workspace {
  return {
    id: workspace.gid,
    name: workspace.name,
    projects: {
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        nextPage: ''
      }
    }
  };
}

export function convertTask(task: asana.resources.Tasks.Type): Task {
  const custom_field = task.custom_fields.find(field => (field.name === 'Story Points' && (field as any).number_value));
  return {
    id: uuidv5(task.gid, TASK_ID_NAMESPACE),
    taskId: task.gid,
    name: task.name,
    storyPoints: custom_field ? (custom_field as any).number_value ? (custom_field as any).number_value : 1 : 1,
    hasPoints: custom_field ? (custom_field as any).number_value ? true : false : false,
    hasDueDate: Boolean(task.due_on),
    complete: task.completed,
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
    },
    burndowns: {
      totalCount: 0,
      edges: [],
      pageInfo: {
        startCursor: '',
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  };
}
