import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import Content from '../../../../../components/Content';

const useStyles = makeStyles(theme =>
  createStyles({
    paperContent: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3),
      position: 'relative'
    },
    projectDescription: {
      marginTop: theme.spacing(1)
    },
    defaultPoints: {
      color: theme.palette.secondary.dark
    },
    loadingSpinnerContainer: {
      display: 'flex'
    },
    loadingSpinner: {
      margin: 'auto',
      color: theme.palette.text.primary,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    tasksLoadingSpinnerBackground: {
      position: 'absolute',
      top: theme.spacing(3),
      left: theme.spacing(3),
      right: theme.spacing(3),
      bottom: theme.spacing(3),
      width: `calc(100% - ${theme.spacing(3) * 2}px)`,
      height: `calc(100% - ${theme.spacing(3) * 2}px)`,
      backgroundColor: theme.palette.background.paper,
      opacity: 0.5
    },
    tasksLoadingSpinnerContainer: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      display: 'flex',
      width: '100%'
    },
    headerContent: {
      padding: theme.spacing(4)
    }
  })
);

const Project: NextPage = () => {
  const classes = useStyles({});
  return (
    <Content disableToolbar>
      
    </Content>
  );
};

export default Project;