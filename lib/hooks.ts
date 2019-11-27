import { useState } from 'react';
import { useViewerQuery, User, useWorkspacesQuery, useWorkspaceQuery, WorkspaceFragment, useProjectsQuery, ProjectFragment, useProjectQuery } from '../graphql';
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
  const { data, loading, error } = useWorkspaceQuery({ variables: { id: workspaceId } });
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
  // Loading state hooks
  const [loadingMore, setLoadingMore] = useState(false);
  // Use projects query hook
  const { data, loading, error, fetchMore } = useProjectsQuery({ 
    variables: {
      workspaceId,
      first: options ? options.first : undefined,
      after: options ? options.after : undefined,
      archived: options ? options.archived : undefined,
    }
  });
  // Check if data was loaded
  let projects: ProjectFragment[] = [];
  let nextPageToken: string;
  if (data) {
    if (data.workspace) {
      if (data.workspace.projects) {
        projects = data.workspace.projects.nodes;
        if (data.workspace.projects.nextPage) {
          nextPageToken = data.workspace.projects.nextPage;
        }
      }
    }
  }
  // Setup state hooks
  const [hasNextPage, setHasNextPage] = useState(Boolean(nextPageToken));
  // Load more function
  const loadMore = () => {
    // Only load more if there is another page
    if (nextPageToken) {
      // Set loading more
      setLoadingMore(true);
      // Call apollo fetchMore function
      return fetchMore({
        variables: {
          after: nextPageToken
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          // Set loading more
          setLoadingMore(false);
          // Extract the data
          const previousProjects = previousResult.workspace.projects.nodes;
          const newProjects = fetchMoreResult.workspace.projects.nodes;
          nextPageToken = fetchMoreResult.workspace.projects.nextPage;
          setHasNextPage(Boolean(nextPageToken));
          return {
            ...previousResult,
            workspace: {
              ...previousResult.workspace,
              projects: {
                ...previousResult.workspace.projects,
                nodes: [...previousProjects, ...newProjects],
                nextPage: fetchMoreResult.workspace.projects.nextPage
              }
            }
          };
        }
      });
    }
    return new Promise(() => {});
  };
  return { projects, loading, error, hasNextPage, loadMore, loadingMore };
};

export const useProject = (id: string) => {
  const { data, loading, error } = useProjectQuery({
    variables: {
      id
    }
  });
  let project: ProjectFragment = null;
  if (data) {
    if (data.project) {
      project = data.project;
    }
  }
  return { project, loading, error };
};
