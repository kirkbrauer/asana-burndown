import React, { FunctionComponent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { useWorkspaces } from '../lib/hooks';
import { useRouter } from 'next/router';
import { useAppContext } from '../lib/context';

type WorkspaceSelectorProps = {
  open: boolean;
  onClose: () => void;
};

const WorkspaceSelector: FunctionComponent<WorkspaceSelectorProps> = ({ open, onClose }) => {
  const { workspaces, loading } = useWorkspaces();
  const { workspaceId, setWorkspaceId } = useAppContext();
  const router = useRouter();

  const openWorkspace = (id: string) => {
    setWorkspaceId(id);
    router.push('/w/[workspaceId]', `/w/${id}`);
  };

  return (
    <Dialog aria-labelledby="workspaces-dialog-title" open={open} onClose={() => onClose()}>
      <DialogTitle id="workspaces-dialog-title">Select an Asana Workspace</DialogTitle>
      {!loading && (
        <List>
          {workspaces.map(workspace => (
            <ListItem button key={workspace.id} onClick={() => {
              openWorkspace(workspace.id);
              onClose();
            }}>
              <ListItemIcon>
                {workspaceId === workspace.id ? <RadioButtonCheckedIcon color="primary" /> : <RadioButtonUncheckedIcon />}
              </ListItemIcon>
              <ListItemText primary={workspace.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Dialog>
  );
};

export default WorkspaceSelector;
