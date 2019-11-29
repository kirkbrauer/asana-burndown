import { IResolvers } from 'graphql-tools';
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
      return convertWorkspace(await client.workspaces.findById(id));
    },
    async project(obj: any, { id }, { client }) {
      const project = await client.projects.findById(id, {
        opt_fields: 'name,archived,current_status,created_at,modified_at,color,notes,workspace,due_on,due_at,start_on'
      });
      return convertProject(project);
    },
    async task(obj: any, { id }, { client }) {
      return convertTask(await client.tasks.findById(id));
    }
  },
  User: {
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
      // Load the workspaces
      const workspaceData = await client.workspaces.findAll({ offset: after, limit: first || 10 });
      const workspaces = workspaceData.data.map(data => convertWorkspace(data));
      // Return the data
      return {
        nodes: workspaces,
        pageInfo: {
          nextPage: workspaceData._response.next_page ? workspaceData._response.next_page.offset : undefined,
          hasNextPage: Boolean(workspaceData._response.next_page)
        }
      };
    }
  },
  Workspace: {
    async projects(workspace: Workspace, { first, after, archived }, { client }) {
      // Load the projects
      const projectData = await client.projects.findByWorkspace(parseInt(workspace.id, 10), {
        archived,
        offset: after,
        limit: first || 10,
        opt_fields: 'name,archived,current_status,created_at,modified_at,color,notes,workspace,due_on,due_at,start_on'
      });
      // Return the data
      const projects = projectData.data.map(project => convertProject(project));
      // Return the data
      return {
        nodes: projects,
        pageInfo: {
          nextPage: projectData._response.next_page ? projectData._response.next_page.offset : undefined,
          hasNextPage: Boolean(projectData._response.next_page)
        }
      };
    }
  },
  Project: {
    url(project: Project) {
      return `https://app.asana.com/0/${project.id}`;
    },
    async tasks(project: Project, { first, after }, { client }) {
      // Load the taks
      const taskData = await client.tasks.findByProject(project.id, {
        offset: after,
        limit: first || 10,
        opt_fields: 'name,created_at,completed_at,completed,due_on,parent,custom_fields'
      });
      const tasks = taskData.data.map(task => convertTask(task));
      // Return the data
      return {
        nodes: tasks,
        pageInfo: {
          nextPage: taskData._response.next_page ? taskData._response.next_page.offset : undefined,
          hasNextPage: Boolean(taskData._response.next_page)
        }
      };
    },
    async workspace(project: Project, {}, { client }) {
      return convertWorkspace(await client.workspaces.findById(parseInt(project.workspace.id, 10)));
    }
  }
};

export default resolvers;
