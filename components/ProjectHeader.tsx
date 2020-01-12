import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { useProject } from '../lib/hooks';
import { useRouter } from 'next/router';
import Moment from 'react-moment';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme =>
  createStyles({
    projectDescription: {
      marginTop: theme.spacing(1)
    },
    headerContent: {
      padding: theme.spacing(4)
    },
    loadingSpinnerContainer: {
      display: 'flex',
      marginTop: '20%'
    },
    loadingSpinner: {
      margin: 'auto',
      color: theme.palette.text.primary,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  })
);

const ProjectHeader = () => {
  const classes = useStyles({});
  const router = useRouter();
  const { project, loading } = useProject(router.query.projectId as string);
  let dates;
  if (loading) {
    return (
      <div className={classes.loadingSpinnerContainer}>
        <CircularProgress className={classes.loadingSpinner} />
      </div>
    );
  }
  if (project) {
    if (project.dueOn && project.startOn) {
      dates = (
        <Typography className={classes.projectDescription}>
          <Moment date={project.startOn} format="M/D/YY" /> - <Moment date={project.dueOn} format="M/D/YY" />
        </Typography>
      );
    } else if (project.dueOn) {
      dates = (
        <Typography className={classes.projectDescription}>Due On: <Moment date={project.dueOn} format="M/D/YY" /></Typography>
      );
    }
    return (
      <AppBar position="static" color="default">
        <div className={classes.headerContent}>
          <Typography variant="h4">{project.name}</Typography>
          <Typography variant="body1" className={classes.projectDescription}>{project.description}</Typography>
          {dates}
        </div>
        <Tabs value={router.route} centered onChange={(e, route) => {
          router.push(route, `/w/${router.query.workspaceId}/p/${router.query.projectId}/${route.split('/')[5] || ''}`);
        }}>
          <Tab label="Overview" value="/w/[workspaceId]/p/[projectId]" />
          <Tab label="Tasks" value="/w/[workspaceId]/p/[projectId]/tasks" />
          <Tab label="Burndown" value="/w/[workspaceId]/p/[projectId]/burndown" />
        </Tabs>
      </AppBar>
    );
  }
  return <AppBar position="static" color="default"/>;
};

export default ProjectHeader;
