import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Content from '../../../../../components/Content';
import { useRouter } from 'next/router';
import { useProjectStatistics } from '../../../../../lib/hooks';
import ProjectStatistic from '../../../../../components/ProjectStatistic';

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
  const router = useRouter();
  const { loading, totalCount, totalPoints, completeCount, completePoints, incompleteCount, incompletePoints, overdueCount, overduePoints, upcomingCount, upcomingPoints, missingStoryPointsCount, missingDueDateCount, missingDueDatePoints } = useProjectStatistics(router.query.projectId as string);
  let content;
  if (loading) {
    content = (
      <div className={classes.loadingSpinnerContainer}>
        <CircularProgress className={classes.loadingSpinner} />
      </div>
    );
  } else {
    content = (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <ProjectStatistic
            title="All Tasks"
            count={totalCount}
            points={totalPoints}
            color="lightgray"
            onClick={() => {
              router.push('/w/[workspaceId]/p/[projectId]/tasks', `/w/${router.query.workspaceId}/p/${router.query.projectId}/tasks`);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <ProjectStatistic
            title="Complete"
            count={completeCount}
            points={completePoints}
            color="#62d26f"
            onClick={() => {
              router.push('/w/[workspaceId]/p/[projectId]/tasks', `/w/${router.query.workspaceId}/p/${router.query.projectId}/tasks?filter=complete`);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <ProjectStatistic
            title="Incomplete"
            count={incompleteCount}
            points={incompletePoints}
            color="#fd9a00"
            onClick={() => {
              router.push('/w/[workspaceId]/p/[projectId]/tasks', `/w/${router.query.workspaceId}/p/${router.query.projectId}/tasks?filter=incomplete`);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <ProjectStatistic
            title="Overdue"
            count={overdueCount}
            points={overduePoints}
            color="#e8384f"
            onClick={() => {
              router.push('/w/[workspaceId]/p/[projectId]/tasks', `/w/${router.query.workspaceId}/p/${router.query.projectId}/tasks?filter=overdue`);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <ProjectStatistic
            title="Upcoming"
            count={upcomingCount}
            points={upcomingPoints}
            color="#4186e0"
            onClick={() => {
              router.push('/w/[workspaceId]/p/[projectId]/tasks', `/w/${router.query.workspaceId}/p/${router.query.projectId}/tasks?filter=upcoming`);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <ProjectStatistic
            title="Missing Due Date"
            count={missingDueDateCount}
            points={missingDueDatePoints}
            color="#4186e0"
            onClick={() => {
              router.push('/w/[workspaceId]/p/[projectId]/tasks', `/w/${router.query.workspaceId}/p/${router.query.projectId}/tasks?filter=missingDueDate`);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <ProjectStatistic
            title="Missing Story Points"
            count={missingStoryPointsCount}
            points={missingStoryPointsCount}
            color="#4186e0"
            onClick={() => {
              router.push('/w/[workspaceId]/p/[projectId]/tasks', `/w/${router.query.workspaceId}/p/${router.query.projectId}/tasks?filter=missingStoryPoints`);
            }}
          />
        </Grid>
      </Grid>
    );
  }
  return (
    <Content disableToolbar>
      {content}
    </Content>
  );
};

export default Project;
