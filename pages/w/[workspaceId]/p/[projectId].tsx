import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import Content from '../../../../components/Content';
import { useProject } from '../../../../lib/hooks';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    paperContent: {
      padding: theme.spacing(3)
    }
  })
);

const Project: NextPage = () => {
  const classes = useStyles({});
  const router = useRouter();
  const { project, loading } = useProject(router.query.projectId as string);
  if (loading) {
    return (
      <Content>
        <div style={{ display: 'flex' }}>
          <CircularProgress style={{ margin: 'auto', marginTop: '20%' }} />
        </div>
      </Content>
    );
  }
  if (project) {
    return (
      <Content>
        <Paper className={classes.paperContent}>
          <Typography variant="h5">{project.name}</Typography>
        </Paper>
      </Content>
    );
  }
  return null;
};

export default Project;
