import { useViewerQuery, User, useWorkspacesQuery, Workspace, useWorkspaceQuery, WorkspaceFragment } from '../graphql';
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
