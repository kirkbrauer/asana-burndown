import { useState } from 'react';
import { useViewerQuery, User, useWorkspacesQuery, useWorkspaceQuery, WorkspaceFragment, useProjectsQuery, ProjectFragment, useProjectQuery, PageInfo, ProjectsDocument, ProjectsQuery, ProjectsQueryVariables, ProjectsQueryResult } from '../graphql';
import { useAppContext } from './context';
import { useApolloClient } from '@apollo/react-hooks';

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
  const client = useApolloClient();
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refetching, setRefetching] = useState(false);
  // Check if data was loaded
  let projects: ProjectFragment[] = [];
  let pageInfo: PageInfo = null;
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
