import { getConnection } from 'typeorm';
import { IResolvers } from 'graphql-tools';
import { encode, decode } from 'opaqueid';
import uuid from 'uuid/v4';
import { paginate } from 'typeorm-graphql-pagination';
import User from './entities/User';
import Task from './entities/Task';
import Burndown from './entities/Burndown';
import { ContextType } from './apollo';
import { convertProject, convertWorkspace, convertTask, convertUser } from './asanaClient';
import { Workspace, Project, PhotoSize, Burndown as GraphQLBurndown, Task as GraphQLTask, TaskField, OrderDirection, TaskOrder, BurndownInput, BurndownField, BurndownOrder } from './graphql/types';

const calculateTotalPoints = (tasks: (Task | GraphQLTask)[]) => {
  let totalPoints = 0;
  // Get the total number of points
  for (const task of tasks) {
    totalPoints += task.storyPoints;
  }
  return totalPoints;
};

const taskFieldToString = (field: TaskField) => {
  switch (field) {
    case TaskField.TaskId: return 'taskId';
    case TaskField.StoryPoints: return 'storyPoints';
    case TaskField.CompletedAt: return 'completedAt';
    case TaskField.DueOn: return 'dueOn';
    case TaskField.CreatedAt: return 'createdAt';
    case TaskField.ModifiedAt: return 'modifiedAt';
  }
};

const resolvers: IResolvers<{}, ContextType> = {
  Query: {
    async viewer(obj: any, {}, { client, user }) {
      return { ...convertUser(await client.users.me({ opt_fields: 'photo,email,name' })), ...user };
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
  Mutation: {
    async generateBurndown(obj: any, { projectId }, { user, client }) {
      // Load the project tasks from the Asana API
      let offset = undefined;
      let tasks = [];
      do {
        const taskData = await client.tasks.findByProject(projectId, {
          offset,
          limit: 100,
          opt_fields: 'name,created_at,completed_at,completed,due_on,parent,custom_fields'
        });
        if (taskData._response.next_page) offset = taskData._response.next_page.offset;
        else offset = undefined;
        tasks = [...tasks, ...taskData.data.map((task) => {
          const convertedTask = convertTask(task);
          // Set the task ID
          convertedTask.id = uuid();
          convertedTask.taskId = task.gid;
          return convertedTask;
        })];
      } while (offset);
      return {
        tasks,
        user: user as any,
        id: uuid(),
        project: projectId
      };
    },
    async saveBurndown(obj: any, { burndown }: { burndown: BurndownInput }, { user }) {
      // Create a new burndown chart
      const newBurndown = new Burndown();
      newBurndown.id = burndown.id;
      newBurndown.name = burndown.name;
      newBurndown.description = burndown.description;
      newBurndown.project = burndown.projectId;
      newBurndown.user = Promise.resolve(user);
      // Save the new burndown chart
      const savedBurndown = await getConnection().getRepository(Burndown).save(newBurndown);
      // Convert the tasks into entities
      const taskEntities = burndown.tasks.map((task) => {
        const taskEntity = new Task();
        taskEntity.id = task.id;
        taskEntity.taskId = task.taskId;
        taskEntity.name = task.name;
        taskEntity.storyPoints = task.storyPoints;
        taskEntity.completed = task.completed;
        taskEntity.completedAt = task.completedAt;
        taskEntity.dueOn = task.dueOn;
        taskEntity.hasPoints = task.hasPoints;
        taskEntity.createdAt = task.createdAt;
        taskEntity.modifiedAt = task.modifiedAt;
        // Set the task entity burndown chart
        taskEntity.burndowns = Promise.resolve([savedBurndown]);
        return taskEntity;
      });
      // Save the task entities
      await getConnection().getRepository(Task).save(taskEntities);
      // Return the saved burndown
      return savedBurndown;
    }
  },
  Burndown: {
    async tasks(burndown: Burndown | GraphQLBurndown, { first, after, completed, hasPoints, orderBy }) {
      const order: TaskOrder = orderBy || { field: TaskField.CreatedAt, direction: OrderDirection.Asc };
      if (burndown.tasks instanceof Promise) {
        let queryBuilder = getConnection()
          .getRepository(Task)
          .createQueryBuilder('task')
          .innerJoin('task.burndowns', 'taskBurndown', 'taskBurndown.id = :burndownId', { burndownId: burndown.id });
        if (completed !== undefined) {
          queryBuilder = queryBuilder.where('task.completed = :completed', { completed });
        }
        if (hasPoints !== undefined) {
          queryBuilder = queryBuilder.where('task.hasPoints = :hasPoints', { hasPoints });
        }
        return paginate({
          after,
          first: first || 10,
          orderBy: order as any
        }, {
          queryBuilder,
          type: 'Task',
          alias: 'task',
          validateCursor: true,
          orderFieldToKey: taskFieldToString
        });
      }
      let tasks = burndown.tasks as GraphQLTask[];
      const field = taskFieldToString(order.field);
      // Sort the tasks
      tasks = tasks.sort((taskA, taskB) => {
        let aField: any = taskA[field];
        let bField: any = taskB[field];
        // Nulls come first
        if (aField instanceof Date && bField instanceof Date) {
          aField = aField.getTime();
          bField = bField.getTime();
        }
        if (order.direction === OrderDirection.Asc) {
          // Nulls come last
          if (!aField) {
            return 1;
          }
          if (!bField) {
            return -1;
          }
          return aField - bField;
        }
        // Nulls come first
        if (!aField) {
          return -1;
        }
        if (!bField) {
          return 1;
        }
        return bField - aField;
      });
      // Get the total count
      const totalCount = tasks.length;
      // Handle pagination
      let offset = 0;
      if (after) {
        // Read the index from the cursor and set the offset
        offset = parseInt(decode(after).split('|')[2], 10) + 1;
      }
      let count = 10;
      if (first) {
        count = first;
      }
      tasks = tasks.slice(offset, count + offset);
      // Filter tasks
      if (completed !== undefined) {
        tasks = tasks.filter(task => task.completed === completed);
      }
      if (hasPoints !== undefined) {
        tasks = tasks.filter(task => task.hasPoints === hasPoints);
      }
      // Convert tasks to task edges and generate cursors
      const edges = tasks.map((task, index) => ({
        node: task,
        cursor: encode(`C|Task|${offset + index}`)
      }));
      // Return paginated tasks
      return {
        totalCount,
        edges,
        pageInfo: {
          hasPreviousPage: offset !== 0,
          hasNextPage: edges.length < totalCount,
          startCursor: encode(`C|Task|${offset}`),
          endCursor: encode(`C|Task|${offset + tasks.length - 1}`)
        }
      };
    },
    async currentPath(burndown: Burndown | GraphQLBurndown) {
      if (burndown.tasks instanceof Promise) {
        const tasks: Task[] = await getConnection()
        .getRepository(Task)
        .createQueryBuilder('task')
        .innerJoin('task.burndowns', 'taskBurndown', 'taskBurndown.id = :burndownId', { burndownId: burndown.id })
        .where('task.dueOn IS NOT NULL')
        .orderBy('task.completedAt', 'ASC', 'NULLS FIRST')
        .getMany();
        // Generate the current path
        let points = calculateTotalPoints(tasks);
        return tasks
          .filter(task => task.completed)
          .filter(task => task.completedAt)
          .filter(task => task.completedAt.getTime() <= Date.now())
          .map((task) => {
            // Subtract the task's story points from the total points
            points -= task.storyPoints;
            return {
              x: task.completedAt!,
              y: points
            };
          });
      }
      let tasks = burndown.tasks as GraphQLTask[];
      tasks = tasks.filter(task => task.dueOn);
      let points = calculateTotalPoints(tasks);
      return tasks
        .filter(task => task.completed)
        .filter(task => task.completedAt)
        .filter(task => task.completedAt.getTime() <= Date.now())
        .sort((taskA, taskB) => {
          return taskA.completedAt!.getTime() - taskB.completedAt!.getTime();
        })
        .map((task) => {
          // Subtract the task's story points from the total points
          points -= task.storyPoints;
          return {
            x: task.completedAt!,
            y: points
          };
        });
    },
    async expectedPath(burndown: Burndown) {
      if (burndown.tasks instanceof Promise) {
        const tasks: Task[] = await getConnection()
          .getRepository(Task)
          .createQueryBuilder('task')
          .innerJoin('task.burndowns', 'taskBurndown', 'taskBurndown.id = :burndownId', { burndownId: burndown.id })
          .where('task.dueOn IS NOT NULL')
          .orderBy('task.completedAt', 'ASC', 'NULLS FIRST')
          .getMany();
        // Generate the expected path
        let points = calculateTotalPoints(tasks);
        return tasks.map((task) => {
          // Subtract the task's story points from the total points
          points -= task.storyPoints;
          // Push the task to the chart tasks array
          return {
            x: task.dueOn!,
            y: points
          };
        });
      }
      let tasks = burndown.tasks as GraphQLTask[];
      tasks = tasks.filter(task => task.dueOn);
      let points = calculateTotalPoints(tasks);
      return tasks
        .sort((taskA, taskB) => {
          // Nulls come first
          if (!taskA.completedAt) {
            return -1;
          }
          if (!taskB.completedAt) {
            return 1;
          }
          return taskA.completedAt!.getTime() - taskB.completedAt!.getTime();
        })
        .map((task) => {
          // Subtract the task's story points from the total points
          points -= task.storyPoints;
          return {
            x: task.dueOn!,
            y: points
          };
        });
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
    },
    async burndowns(user: User, { first, after, orderBy }) {
      const order: BurndownOrder = orderBy || { field: BurndownField.CreatedAt, direction: OrderDirection.Desc };
      return paginate({
        after,
        first: first || 10,
        orderBy: order as any
      }, {
        queryBuilder: getConnection().getRepository(Burndown).createQueryBuilder('burndown').where('"userId" = :userId', { userId: user.id }),
        type: 'Burndown',
        alias: 'burndown',
        validateCursor: true,
        orderFieldToKey: (field: BurndownField) => {
          switch (field) {
            case BurndownField.CreatedAt: return 'createdAt';
            case BurndownField.ModifiedAt: return 'modifiedAt';
          }
        }
      });
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
    },
    async burndowns(project: Project, { first, after, orderBy }) {
      const order: BurndownOrder = orderBy || { field: BurndownField.CreatedAt, direction: OrderDirection.Desc };
      return paginate({
        after,
        first: first || 10,
        orderBy: order as any
      }, {
        queryBuilder: getConnection().getRepository(Burndown).createQueryBuilder('burndown').where('"project" = :projectId', { projectId: project.id }),
        type: 'Burndown',
        alias: 'burndown',
        validateCursor: true,
        orderFieldToKey: (field: BurndownField) => {
          switch (field) {
            case BurndownField.CreatedAt: return 'createdAt';
            case BurndownField.ModifiedAt: return 'modifiedAt';
          }
        }
      });
    }
  }
};

export default resolvers;
