import { IResolvers } from 'graphql-tools';
import asana from 'asana';
import { encodeId, decodeId } from 'opaqueid';
import User from './entities/User';
import { ContextType } from './apollo';
import { convertProject, convertWorkspace, convertTask, convertUser } from './asanaClient';
import { Workspace, Project, Task, PhotoSize } from './graphql/types';

const resolvers: IResolvers<{}, ContextType> = {
  Query: {
    async viewer(obj: any, {}, { user, client }) {
      return convertUser(await client.users.me({ opt_fields: 'photo,email,name' }));
    },
    async workspace(obj: any, { id }, { client }) {
      return convertWorkspace(await client.workspaces.findById(decodeId(id, 'Workspace') as number));
    },
    async project(obj: any, { id }, { client }) {
      const project = await client.projects.findById(decodeId(id, 'Project') as number, {
        opt_fields: 'name,archived,current_status,created_at,modified_at,color,notes,workspace,due_on,due_at,start_on'
      });
      return convertProject(project);
    },
    async task(obj: any, { id }, { client }) {
      return convertTask(await client.tasks.findById(decodeId(id, 'Task') as number));
    }
  },
  User: {
    id(user: User) {
      return encodeId(user.id, 'User');
    },
    photo(user: User & { photoUrls: any }, { size }) {
      if (user.photoUrls) {
        switch (size) {
          case PhotoSize.Size_21X21:
            return user.photoUrls.image_21x21;
          case PhotoSize.Size_27X27:
            return user.photoUrls.image_27x27;
          case PhotoSize.Size_36X36:
            return user.photoUrls.image_36x36;
          case PhotoSize.Size_60X60:
            return user.photoUrls.image_60x60;
          case PhotoSize.Size_128X128:
            return user.photoUrls.image_128x128;
        }
      }
      return null;
    },
    async workspaces(user: User, { first, after }, { client }) {
      // Decode the cursor
      let offset = undefined;
      if (after) {
        offset = decodeId(after, 'C/Workspace');
      }
      // Load the workspaces
      const workspaceData = await client.workspaces.findAll({ offset, limit: first || 10 });
      const workspaces = workspaceData.data.map(data => convertWorkspace(data));
      // Return the data
      return {
        nodes: workspaces,
        nextPage: workspaceData._response.next_page ? encodeId(workspaceData._response.next_page.offset, 'C/Workspace') : undefined
      };
    }
  },
  Workspace: {
    id(workspace: Workspace) {
      return encodeId(workspace.id, 'Workspace');
    },
    async projects(workspace: Workspace, { first, after, archived }, { client }) {
      // Decode the cursor
      let offset = undefined;
      if (after) {
        offset = decodeId(after, 'C/Project');
      }
      // Load the projects
      const projectData = await client.projects.findByWorkspace(parseInt(workspace.id, 10), { 
        offset,
        archived,
        limit: first || 10,
        opt_fields: 'name,archived,current_status,created_at,modified_at,color,notes,workspace,due_on,due_at,start_on'
      });
      // Return the data
      const projects = projectData.data.map(project => convertProject(project));
      // Return the data
      return {
        nodes: projects,
        nextPage: projectData._response.next_page ? encodeId(projectData._response.next_page.offset, 'C/Project') : undefined
      };
    }
  },
  Project: {
    id(project: Project) {
      return encodeId(project.id, 'Project');
    },
    url(project: Project) {
      return `https://app.asana.com/0/${project.id}`;
    },
    async tasks(project: Project, { first, after }, { client }) {
      // Decode the cursor
      let offset = undefined;
      if (after) {
        offset = decodeId(after, 'C/Task');
      }
      // Load the taks
      const taskData = await client.tasks.findByProject(project.id, {
        offset,
        limit: first || 10,
        opt_fields: 'name,created_at,completed_at,completed,due_on,parent,custom_fields'
      });
      const tasks = taskData.data.map(task => convertTask(task));
      // Return the data
      return {
        nodes: tasks,
        nextPage: taskData._response.next_page ? encodeId(taskData._response.next_page.offset, 'C/Task') : undefined
      };
    },
    async workspace(project: Project, {}, { client }) {
      return convertWorkspace(await client.workspaces.findById(parseInt(project.workspace.id, 10)));
    }
  },
  Task: {
    id(task: Task) {
      return encodeId(task.id, 'Task');
    }
  }
};

export default resolvers;
