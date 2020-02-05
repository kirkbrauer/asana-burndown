import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import Content from '../../../../../components/Content';
import { useGenerateBurndown, useProject } from '../../../../../lib/hooks';
import { useRouter } from 'next/router';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import BurndownChart from '../../../../../components/BurndownChart';
import Moment from 'react-moment';

const useStyles = makeStyles(theme =>
  createStyles({
    paperContent: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3),
      position: 'relative',
      fontFamily: 'Arial'
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
    },
    legendContainer: {
      display: 'flex',
      marginTop: 16
    },
    legend: {
      margin: 'auto',
      display: 'flex'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      margin: 8
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8
    },
    legendLabel: {
      fontSize: 18,
      fontFamily: 'Arial'
    }
  })
);

const ProjectBurndownPage: NextPage = () => {
  const classes = useStyles({});
  const router = useRouter();
  const { project, loading: loadingProject } = useProject(router.query.projectId as string);
  const { path, loading: generatingBurndown } = useGenerateBurndown(router.query.projectId as string);
  return (
    <Content disableToolbar>
     <Paper className={classes.paperContent}>
        {!generatingBurndown && (
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4" style={{ fontFamily: 'Arial', marginBottom: 8 }}>{loadingProject ? 'Loading...' : project.name}</Typography>
            <Typography variant="body1" style={{ fontFamily: 'Arial' }}>Generated <Moment format="LLLL"/></Typography>
          </div>
        )}
        <BurndownChart loading={generatingBurndown} path={path} />
        {!generatingBurndown && (
          <div className={classes.legendContainer}>
            <div className={classes.legend}>
              <div className={classes.legendItem}>
                <div className={classes.legendDot} style={{ backgroundColor: 'red' }}/>
                <Typography className={classes.legendLabel}>Current Progress</Typography>
              </div>
              <div className={classes.legendItem}>
                <div className={classes.legendDot} style={{ backgroundColor: 'blue' }}/>
                <Typography className={classes.legendLabel}>Expected Progress</Typography>
              </div>
              <div className={classes.legendItem}>
                <div className={classes.legendDot} style={{ backgroundColor: 'green' }}/>
                <Typography className={classes.legendLabel}>Today</Typography>
              </div>
            </div>
          </div>
        )}
      </Paper>
    </Content>
  );
};

export default ProjectBurndownPage;
