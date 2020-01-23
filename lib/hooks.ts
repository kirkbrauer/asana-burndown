import { useState } from 'react';
import { useViewerQuery, User, useWorkspacesQuery, useWorkspaceQuery, WorkspaceFragment, useProjectsQuery, ProjectFragment, useProjectQuery, AsanaPageInfo, Burndown, useGenerateBurndownQuery, BurndownPoint, Task, PageInfo, useProjectTasksQuery, TaskOrder, DateQuery, DateTimeQuery, IntQuery, useProjectStatisticsQuery, useUpdateTaskMutation, UpdateTaskInput, ProjectTasksDocument, TaskEdge } from '../graphql';
import { useAppContext } from './context';

export const useViewer = () => {
  const { data, loading, error } = useViewerQuery();
  let viewer: Pick<User, 'id' | 'email' | 'name' | 'photo'> = null;
  if (data) {
    if (data.viewer) {
      viewer = data.viewer;
    }
  }
  return { viewer, loading, error };
};

export const useWorkspaces = () => {
  const { data, loading, error } = useWorkspacesQuery();
  let workspaces: WorkspaceFragment[] = [];
  if (data) {
    if (data.viewer) {
      if (data.viewer.workspaces) {
        workspaces = data.viewer.workspaces.nodes;
      }
    }
  }
  return { workspaces, loading, error };
};

export const useCurrentWorkspace = () => {
  const { workspaceId } = useAppContext();
  const { data, loading, error } = useWorkspaceQuery({ variables: { id: workspaceId }, skip: !workspaceId });
  let workspace: WorkspaceFragment;
  if (data) {
    if (data.workspace) {
      workspace = data.workspace;
    }
  }
  return { workspace, loading, error };
};

type UseProjectsOptions = {
  first?: number,
  after?: string,
  archived?: boolean
};

export const useProjects = (workspaceId: string, options?: UseProjectsOptions) => {
  // Use projects query hook
  const { data, loading, error, fetchMore: fetchMoreFn, refetch: refetchFn } = useProjectsQuery({ 
    variables: {
      workspaceId,
      ...options
    }
  });
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refetching, setRefetching] = useState(false);
  // Check if data was loaded
  let projects: ProjectFragment[] = [];
  let pageInfo: AsanaPageInfo = null;
  let hasNextPage = false;
  if (data) {
    if (data.workspace) {
      if (data.workspace.projects) {
        projects = data.workspace.projects.nodes;
        pageInfo = data.workspace.projects.pageInfo;
        hasNextPage = pageInfo.hasNextPage;
      }
    }
  }
  // Load more function
  const fetchMore = async () => {
    setFetchingMore(true);
    return fetchMoreFn({
      variables: {
        workspaceId,
        ...options,
        after: pageInfo.nextPage
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult) {
          // Extract the data
          const previousProjects = previousResult.workspace.projects.nodes;
          const newProjects = fetchMoreResult.workspace.projects.nodes;
          const pageInfo = fetchMoreResult.workspace.projects.pageInfo;
          // Merge the new data with the old data
          return {
            ...previousResult,
            workspace: {
              ...previousResult.workspace,
              projects: {
                ...previousResult.workspace.projects,
                pageInfo,
                nodes: [...previousProjects, ...newProjects]
              }
            }
          };
        }
        return previousResult;
      }
    }).then(() => setFetchingMore(false));
  };
  const refetch = async () => {
    setRefetching(true);
    return refetchFn({ workspaceId, ...options }).then(() => setRefetching(false));
  };
  return { projects, loading, error, hasNextPage, fetchMore, fetchingMore, refetch, refetching };
};

export const useProject = (id: string) => {
  const { data, loading, error } = useProjectQuery({
    variables: {
      id
    }
  });
  let project: ProjectFragment & { workspace: WorkspaceFragment } = null;
  if (data) {
    if (data.project) {
      project = data.project;
    }
  }
  return { project, loading, error };
};

export const useGenerateBurndown = (projectId: string) => {
  const { data, loading, error } = useGenerateBurndownQuery({
    variables: {
      projectId
    },
    ssr: false
  });
  let burndown: Partial<Burndown>;
  let path: BurndownPoint[] = [];
  if (data) {
    if (data.project) {
      if (data.project.burndown) {
        burndown = data.project.burndown;
        path = data.project.burndown.path;
      }
    }
  }
  return { burndown, path, loading, error };
};

type TaskConnectionOptions = {
  first?: number,
  after?: string,
  skip?: number,
  complete?: boolean,
  storyPoints?: IntQuery,
  hasPoints?: boolean,
  orderBy?: TaskOrder,
  dueOn?: DateQuery,
  completedAt?: DateTimeQuery,
  createdAt?: DateTimeQuery,
  modifiedAt?: DateTimeQuery,
  hasDueDate?: boolean,
  reload?: boolean
};

export const useProjectTasks = (projectId: string, options: TaskConnectionOptions) => {
  const { data, loading, error, fetchMore: fetchMoreFn, refetch: refetchFn } = useProjectTasksQuery({ 
    variables: {
      ...options,
      reload: false,
      id: projectId
    },
    ssr: false
  });
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refetching, setRefetching] = useState(false);
  let tasks: Partial<Task>[] = [];
  let tasksPageInfo: PageInfo;
  let tasksTotalCount: number = 0;
  let tasksTotalPoints: number = 0;
  if (data) {
    if (data.project) {
      tasks = data.project.tasks.edges.map(edge => edge.node);
      tasksPageInfo = data.project.tasks.pageInfo;
      tasksTotalCount = data.project.tasks.totalCount;
      tasksTotalPoints = data.project.tasks.totalPoints;
    }
  }
  // Load more function
  const fetchMore = async () => {
    setFetchingMore(true);
    return fetchMoreFn({
      variables: {
        ...options,
        after: tasksPageInfo.endCursor
      },
      updateQuery: (previousResult: any, { fetchMoreResult }) => {
        if (fetchMoreResult) {
          // Extract the data
          const previousTaskEdges = previousResult.project.tasks.edges;
          const newTaskEdges = fetchMoreResult.project.tasks.edges;
          const pageInfo = fetchMoreResult.project.tasks.pageInfo;
          // Merge the new data with the old data
          return {
            ...previousResult,
            project: {
              ...previousResult.project,
              tasks: {
                ...previousResult.project.tasks,
                pageInfo,
                edges: [...previousTaskEdges, ...newTaskEdges]
              }
            }
          };
        }
        return previousResult;
      }
    }).then(() => setFetchingMore(false));
  };
  const refetch = async () => {
    setRefetching(true);
    return refetchFn({ ...options, id: projectId, reload: true }).then(() => setRefetching(false));
  };
  return { tasks, tasksPageInfo, tasksTotalCount, tasksTotalPoints, loading, error, fetchMore, fetchingMore, refetch, refetching };
};

export const useProjectStatistics = (projectId: string) => {
  const { data, loading, error } = useProjectStatisticsQuery({
    variables: {
      id: projectId,
      start: new Date(Date.now()).toISOString().substr(0, 10),
      end: new Date(Date.now() + 1000 * (60 * 60 * 24 * 7)).toISOString().substr(0, 10)
    }
  });
  let totalCount: number;
  let totalPoints: number;
  let completeCount: number;
  let completePoints: number;
  let incompleteCount: number;
  let incompletePoints: number;
  let missingDueDateCount: number;
  let missingDueDatePoints: number;
  let missingStoryPointsCount: number;
  let upcomingCount: number;
  let upcomingPoints: number;
  let overdueCount: number;
  let overduePoints: number;
  let missingDueDateTasks: Partial<Task>[] = [];
  let missingStoryPointsTasks: Partial<Task>[] = [];
  let upcomingTasks: Partial<Task>[] = [];
  let overdueTasks: Partial<Task>[] = [];
  if (data) {
    if (data.project) {
      totalCount = data.project.allTasks.totalCount;
      totalPoints = data.project.allTasks.totalPoints;
      completeCount = data.project.completeTasks.totalCount;
      completePoints = data.project.completeTasks.totalPoints;
      incompleteCount = data.project.incompleteTasks.totalCount;
      incompletePoints = data.project.incompleteTasks.totalPoints;
      missingDueDateCount = data.project.missingDueDate.totalCount;
      missingDueDatePoints = data.project.missingDueDate.totalPoints;
      missingStoryPointsCount = data.project.missingStoryPoints.totalCount;
      upcomingCount = data.project.upcomingTasks.totalCount;
      upcomingPoints = data.project.upcomingTasks.totalPoints;
      overdueCount = data.project.overdueTasks.totalCount;
      overduePoints = data.project.overdueTasks.totalPoints;
      missingDueDateTasks = data.project.missingDueDate.edges.map(edge => edge.node);
      missingStoryPointsTasks = data.project.missingStoryPoints.edges.map(edge => edge.node);
      upcomingTasks = data.project.upcomingTasks.edges.map(edge => edge.node);
      overdueTasks = data.project.overdueTasks.edges.map(edge => edge.node);
    }
  }
  return { loading, totalCount, totalPoints, completeCount, completePoints, incompleteCount, incompletePoints, missingDueDateCount, missingDueDatePoints, missingStoryPointsCount, upcomingCount, upcomingPoints, overdueCount, overduePoints, missingDueDateTasks, missingStoryPointsTasks, upcomingTasks, overdueTasks };
};

export const useUpdateProjectTask = (projectId: string, options: TaskConnectionOptions) => {
  const [mutationFn] = useUpdateTaskMutation({
    update(cache, { data }) {
      // Attempt to load the project query
      const { project } = cache.readQuery({ 
        query: ProjectTasksDocument,
        variables: {
          ...options,
          id: projectId,
          reload: false
        }
      });
      // Attempt to update the cached query
      cache.writeQuery({
        query: ProjectTasksDocument,
        variables: {
          ...options,
          id: projectId,
          reload: false
        },
        data: {
          project: {
            ...project,
            tasks: {
              ...project.tasks,
              edges: project.tasks.edges.map((edge: TaskEdge) => {
                if (edge.node.id === data.updateTask.id) {
                  return {
                    ...edge,
                    node: data.updateTask
                  };
                }
                return edge;
              })
            }
          }
        }
      });
    }
  });
  const updateTask = (id: string, data: UpdateTaskInput, task: Task) => {
    return mutationFn({
      variables: {
        id,
        data
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateTask: {
          ...task,
          ...data,
          __typename: 'Task'
        }
      }
    });
  };
  return updateTask;
};
