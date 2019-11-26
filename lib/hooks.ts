import { useViewerQuery, User, useWorkspacesQuery, Workspace, useWorkspaceQuery } from '../graphql';
import { useAppContext } from './context';

export const useViewer = () => {
  const { data, loading, error } = useViewerQuery();
  let viewer: User = null;
  if (data) {
    if (data.viewer) {
      viewer = data.viewer;
    }
  }
  return { viewer, loading, error };
};

export const useWorkspaces = () => {
  const { data, loading, error } = useWorkspacesQuery();
  let workspaces: Workspace[] = [];
  if (data) {
    if (data.workspaces) {
      workspaces = data.workspaces.nodes;
    }
  }
  return { workspaces, loading, error };
};

export const useCurrentWorkspace = () => {
  const { workspaceId } = useAppContext();
  const { data, loading, error } = useWorkspaceQuery({ variables: { id: workspaceId } });
  let workspace: Workspace;
  if (data) {
    if (data.workspace) {
      workspace = data.workspace;
    }
  }
  return { workspace, loading, error };
};
