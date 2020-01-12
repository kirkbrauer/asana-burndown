import React, { FunctionComponent, useRef } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Content from '../../../components/Content';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { useProjects } from '../../../lib/hooks';
import { useAppContext } from '../../../lib/context';
import ProjectCard from '../../../components/ProjectCard';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loadingContainer: {
      display: 'flex'
    },
    loadingSpinner: {
      margin: 'auto',
      marginTop: '20%'
    },
    loadMoreContainer: {
      display: 'flex',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2)
    }
  })
);

const Projects: FunctionComponent = () => {
  const { workspaceId } = useAppContext();
  const { projects, loading, hasNextPage, fetchMore, fetchingMore } = useProjects(workspaceId, { first: 50, archived: false });
  const router = useRouter();
  const classes = useStyles({});
  let content;
  if (loading) {
    content = (
      <div style={{ display: 'flex' }}>
        <CircularProgress style={{ margin: 'auto', marginTop: '20%' }} />
      </div>
    );
  } else if (projects) {
    content = (
      <>
        <Grid container spacing={3}>
          {projects.map(project => (
            <Grid item zeroMinWidth key={project.id} xs={12} sm={12} md={6} lg={3} xl={2}>
              <ProjectCard 
                project={project} 
                onClickStats={() => {
                  router.push('/w/[workspaceId]/p/[projectId]', `/w/${workspaceId}/p/${project.id}`);
                }}
                onClickTasks={() => {
                  router.push('/w/[workspaceId]/p/[projectId]/tasks', `/w/${workspaceId}/p/${project.id}/tasks`);
                }}
                onClickBurndown={() => {
                  router.push('/w/[workspaceId]/p/[projectId]/burndown', `/w/${workspaceId}/p/${project.id}/burndown`);
                }}
                onClickOpenInAsana={() => window.open(project.url, '_blank')}
                onClick={() => {
                  router.push('/w/[workspaceId]/p/[projectId]', `/w/${workspaceId}/p/${project.id}`);
                }}
              />
            </Grid>
          ))}
        </Grid>
        {fetchingMore ? (
          <div className={classes.loadMoreContainer}>
            <CircularProgress style={{ margin: 'auto' }} />
          </div>
        ) : (hasNextPage && (
          <div className={classes.loadMoreContainer}>
            <Button
              variant="contained"
              style={{ margin: 'auto' }}
              onClick={() => fetchMore()}
            >
              Load More
            </Button>
          </div>
        ))}
      </>
    );
  }
  return (
    <Content>
      {content}
    </Content>
  );
};

export default Projects;
