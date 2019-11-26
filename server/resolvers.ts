import { IResolvers } from 'graphql-tools';
import asana from 'asana';
import { encodeId, decodeId } from 'opaqueid';
import { connection } from './db';
import User from './entities/User';
import { ContextType } from './apollo';

const resolvers: IResolvers<{}, ContextType> = {
  Query: {
    async workspaces(obj: any, { first, after }, { getClient }) {
      const client = await getClient();
      // Decode the cursor
      let offset = undefined;
      if (after) {
        offset = decodeId(after, 'C/Workspace');
      }
      // Load the workspaces
      const workspaceData = await client.workspaces.findAll({ offset, limit: first || 10 });
      // Return the data
      return {
        nodes: workspaceData.data,
        nextPage: workspaceData._response.next_page ? encodeId(workspaceData._response.next_page.offset, 'C/Workspace') : undefined
      };
    },
    async projects(obj: any, { workspace, first, after, archived }, { getClient }) {
      const client = await getClient();
      // Decode the workspace cursor
      const workspaceId = decodeId(workspace, 'Workspace');
      // Decode the cursor
      let offset = undefined;
      if (after) {
        offset = decodeId(after, 'C/Project');
      }
      // Load the projects
      const projectData = await client.projects.findByWorkspace(parseInt(workspaceId as string, 10), { 
        offset,
        archived,
        limit: first || 10,
        opt_fields: 'name,archived,current_status,created_at,modified_at'
      });
      // Return the data
      const projects = projectData.data.map(project => ({
        id: encodeId(project.gid, 'Project'),
        name: project.name,
        archived: project.archived,
        status: project.current_status,
        createdAt: project.created_at,
        modifiedAt: project.modified_at
      }));
      // Return the data
      return {
        nodes: projects,
        nextPage: projectData._response.next_page ? encodeId(projectData._response.next_page.offset, 'C/Project') : undefined
      };
    },
    async tasks(obj: any, { project, first, after }, { getClient }) {
      const client = await getClient();
      // Decode the project cursor
      const projectId = decodeId(project, 'Project');
      // Decode the cursor
      let offset = undefined;
      if (after) {
        offset = decodeId(after, 'C/Task');
      }
      // Load the taks
      const taskData = await client.tasks.findByProject(parseInt(projectId as string, 10), { 
        offset,
        limit: first || 10,
        opt_fields: 'name,created_at,completed_at,completed,due_on,parent,custom_fields'
      });
      // Return the data
      const tasks = taskData.data.map((task) => {
        const custom_field = task.custom_fields.find(field => (field.name === 'Story Points' && (field as any).number_value));
        return {
          id: encodeId(task.gid, 'Task'),
          name: task.name,
          storyPoints: custom_field ? (custom_field as any).number_value ? (custom_field as any).number_value : 1 : 1,
          defaultPoints: custom_field ? (custom_field as any).number_value ? false : true : true,
          completed: task.completed,
          completedAt: task.completed_at,
          dueOn: task.due_on,
          createdAt: task.created_at,
          modifiedAt: task.modified_at
        };
      });
      // Return the data
      return {
        nodes: tasks,
        nextPage: taskData._response.next_page ? encodeId(taskData._response.next_page.offset, 'C/Task') : undefined
      };
    },
    async viewer(obj: any, {}, context) {
      return context.getUser();
    },
    async workspace(obj: any, { id }, { getClient }) {
      const client = await getClient();
      return client.workspaces.findById(decodeId(id, 'Workspace') as number);
    }
  },
  User: {
    id(user: User) {
      return encodeId(user.id, 'User');
    }
  },
  Workspace: {
    id(workspace: asana.resources.Workspaces.Type) {
      return encodeId(workspace.gid, 'Workspace');
    }
  }
};

export default resolvers;
