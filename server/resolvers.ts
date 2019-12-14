import { getConnection } from 'typeorm';
import { IResolvers } from 'graphql-tools';
import { encode, decode } from 'opaqueid';
import _ from 'lodash';
import uuid from 'uuid/v4';
import { paginate } from 'typeorm-graphql-pagination';
import User from './entities/User';
import Task from './entities/Task';
import Burndown from './entities/Burndown';
import { ContextType } from './apollo';
import { convertProject, convertWorkspace, convertTask, convertUser } from './asanaClient';
import { Workspace, Project, PhotoSize, Burndown as GraphQLBurndown, Task as GraphQLTask, TaskField, OrderDirection, TaskOrder, BurndownInput, BurndownField, BurndownOrder, BurndownPoint } from './graphql/types';

const calculateTotalPoints = (tasks: (Task | GraphQLTask)[]) => {
  let totalPoints = 0;
  // Get the total number of points
  for (const task of tasks) {
    totalPoints += task.storyPoints;
  }
  return totalPoints;
};

const generatePath = (tasks: (Task | GraphQLTask)[]) => {
  const expectedTasks = _.groupBy(tasks, (task: Task) => task.dueOn ? (task.dueOn instanceof Date ? new Date(task.dueOn.toISOString().substr(0, 10)).getTime() : task.dueOn) : null);
  const completedTasks = _.groupBy(tasks.filter(task => task.completed), (task: Task) => task.completedAt instanceof Date ? new Date(task.completedAt.toISOString().substr(0, 10)).getTime() : task.completedAt);
  const dates = _.uniq([...Object.keys(expectedTasks), ...Object.keys(completedTasks)]).filter(date => date !== 'null').sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  const totalPoints = calculateTotalPoints(tasks);
  let expectedPoints = totalPoints;
  let completedPoints = totalPoints;
  const path: BurndownPoint[] = [];
  for (const date of dates) {
    if (expectedTasks[date]) {
      for (const task of expectedTasks[date] as GraphQLTask[]) {
        expectedPoints -= task.storyPoints;
      }
    }
    if (completedTasks[date]) {
      for (const task of completedTasks[date] as GraphQLTask[]) {
        completedPoints -= task.storyPoints;
      }
    }
    path.push({
      date: new Date(parseInt(date, 10)),
      completed: completedPoints,
      expected: expectedPoints
    });
  }
  return path;
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
    },
    async burndown(obj: any, { id }) {
      return getConnection().getRepository(Burndown).findOne({ id });
    }
  },
  Mutation: {
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
    async tasks(burndown: Burndown | GraphQLBurndown, { first, after, completed, hasPoints, orderBy, dueOn, completedAt, hasDueDate }) {
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
        if (hasDueDate !== undefined) {
          if (hasDueDate) {
            queryBuilder = queryBuilder.where('task.dueOn IS NOT NULL');
          } else {
            queryBuilder = queryBuilder.where('task.dueOn IS NULL');
          }
        }
        if (dueOn !== undefined) {
          if (hasDueDate === undefined) queryBuilder = queryBuilder.where('task.dueOn IS NOT NULL');
          if (dueOn.eq) {
            queryBuilder = queryBuilder.where('task.dueOn = :dueOn', { dueOn: dueOn.eq.toISOString().substr(0, 10) });
          }
          if (dueOn.lt) {
            queryBuilder = queryBuilder.where('task.dueOn < :dueOn', { dueOn: dueOn.lt.toISOString().substr(0, 10) });
          }
          if (dueOn.gt) {
            queryBuilder = queryBuilder.where('task.dueOn > :dueOn', { dueOn: dueOn.gt.toISOString().substr(0, 10) });
          }
          if (dueOn.lte) {
            queryBuilder = queryBuilder.where('task.dueOn <= :dueOn', { dueOn: dueOn.lte.toISOString().substr(0, 10) });
          }
          if (dueOn.gte) {
            queryBuilder = queryBuilder.where('task.dueOn >= :dueOn', { dueOn: dueOn.gte.toISOString().substr(0, 10) });
          }
        }
        if (completedAt !== undefined) {
          queryBuilder = queryBuilder.where('task.completedAt IS NOT NULL');
          if (completedAt.eq) {
            queryBuilder = queryBuilder.where('task.completedAt = :completedAt', { completedAt: completedAt.eq });
          }
          if (completedAt.lt) {
            queryBuilder = queryBuilder.where('task.completedAt < :completedAt', { completedAt: completedAt.lt });
          }
          if (completedAt.gt) {
            queryBuilder = queryBuilder.where('task.completedAt > :completedAt', { completedAt: completedAt.gt });
          }
          if (completedAt.lte) {
            queryBuilder = queryBuilder.where('task.completedAt <= :completedAt', { completedAt: completedAt.lte });
          }
          if (completedAt.gte) {
            queryBuilder = queryBuilder.where('task.completedAt >= :completedAt', { completedAt: completedAt.gte });
          }
        }
        // Paginate the tasks
        const paginated = await paginate({
          after,
          first: first || 1000,
          orderBy: order as any
        }, {
          queryBuilder,
          type: 'Task',
          alias: 'task',
          validateCursor: true,
          orderFieldToKey: taskFieldToString
        });
        // Count the total points
        let totalPoints = 0;
        for (const edge of paginated.edges) {
          totalPoints += edge.node.storyPoints;
        }
        return {
          totalPoints,
          ...paginated
        };
      }
      let tasks: GraphQLTask[] = burndown.tasks as any;
      // Handle pagination
      let offset = 0;
      if (after) {
        // Read the index from the cursor and set the offset
        offset = parseInt(decode(after).split('|')[2], 10) + 1;
      }
      let count = 1000;
      if (first) {
        count = first;
      }
      // Filter tasks
      if (completed !== undefined) {
        tasks = tasks.filter(task => task.completed === completed);
      }
      if (hasPoints !== undefined) {
        tasks = tasks.filter(task => task.hasPoints === hasPoints);
      }
      if (hasDueDate !== undefined) {
        if (hasDueDate) {
          tasks = tasks.filter(task => task.dueOn);
        } else {
          tasks = tasks.filter(task => !task.dueOn);
        }
      }
      if (dueOn !== undefined) {
        if (hasDueDate === undefined) tasks = tasks.filter(task => task.dueOn);
        if (dueOn.eq) {
          tasks = tasks.filter(task => task.dueOn.getTime() === dueOn.eq.getTime());
        }
        if (dueOn.lt) {
          tasks = tasks.filter(task => task.dueOn.getTime() < dueOn.lt.getTime());
        }
        if (dueOn.gt) {
          tasks = tasks.filter(task => task.dueOn.getTime() > dueOn.gt.getTime());
        }
        if (dueOn.lte) {
          tasks = tasks.filter(task => task.dueOn.getTime() <= dueOn.lte.getTime());
        }
        if (dueOn.gte) {
          tasks = tasks.filter(task => task.dueOn.getTime() >= dueOn.gte.getTime());
        }
      }
      if (completedAt !== undefined) {
        tasks = tasks.filter(task => task.completedAt);
        if (completedAt.eq) {
          tasks = tasks.filter(task => task.completedAt.getTime() === completedAt.eq.getTime());
        }
        if (completedAt.lt) {
          tasks = tasks.filter(task => task.completedAt.getTime() < completedAt.lt.getTime());
        }
        if (completedAt.gt) {
          tasks = tasks.filter(task => task.completedAt.getTime() > completedAt.gt.getTime());
        }
        if (completedAt.lte) {
          tasks = tasks.filter(task => task.completedAt.getTime() <= completedAt.lte.getTime());
        }
        if (completedAt.gte) {
          tasks = tasks.filter(task => task.completedAt.getTime() >= completedAt.gte.getTime());
        }
      }
      // Get the total count
      const totalCount = tasks.length;
      // Get the total number of points
      const totalPoints = calculateTotalPoints(tasks);
      // Slice the tasks
      tasks = tasks.slice(offset, count + offset);
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
      // Convert tasks to task edges and generate cursors
      const edges = tasks.map((task, index) => ({
        node: task,
        cursor: encode(`C|Task|${offset + index}`)
      }));
      // Return paginated tasks
      return {
        totalPoints,
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
    async path(burndown: Burndown | GraphQLBurndown) {
      if (burndown.tasks instanceof Promise) {
        const tasks: Task[] = await getConnection()
        .getRepository(Task)
        .createQueryBuilder('task')
        .innerJoin('task.burndowns', 'taskBurndown', 'taskBurndown.id = :burndownId', { burndownId: burndown.id })
        .orderBy('task.completedAt', 'ASC', 'NULLS FIRST')
        .getMany();
        // Generate the current path
        return generatePath(tasks);
      }
      const tasks: GraphQLTask[] = burndown.tasks as any;
      return generatePath(tasks);
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
    },
    async burndown(project: Project, { }, { user, client }) {
      // Load the project tasks from the Asana API
      let offset = undefined;
      let tasks = [];
      do {
        const taskData = await client.tasks.findByProject(project.id, {
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
        createdAt: new Date(Date.now()),
        id: uuid(),
        project: project.id
      };
    },
  },
  Task: {
    hasDueDate(task: Task) {
      return Boolean(task.dueOn);
    }
  }
};

export default resolvers;
