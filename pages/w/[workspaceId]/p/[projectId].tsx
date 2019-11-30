import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import Content from '../../../../components/Content';
import { useProject } from '../../../../lib/hooks';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';

const useStyles = makeStyles(theme =>
  createStyles({
    paperContent: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3)
    },
    projectDescription: {
      marginTop: theme.spacing(1)
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
    let dates;
    if (project.dueOn && project.startOn) {
      dates = (
        <Typography className={classes.projectDescription}>
          <Moment date={project.startOn} format="M/D/YY"/> - <Moment date={project.dueOn} format="M/D/YY"/>
        </Typography>
      );
    } else if (project.dueOn) {
      dates = (
        <Typography className={classes.projectDescription}>Due On: <Moment date={project.dueOn} format="M/D/YY"/></Typography>
      );
    }
    return (
      <Content>
        <Paper className={classes.paperContent}>
          <Typography variant="h4">{project.name}</Typography>
          <Typography variant="body1" className={classes.projectDescription}>{project.description}</Typography>
          {dates}
        </Paper>
        <Paper className={classes.paperContent}>
          <Typography variant="h6">Project Burndown</Typography>
        </Paper>
      </Content>
    );
  }
  return null;
};

export default Project;
