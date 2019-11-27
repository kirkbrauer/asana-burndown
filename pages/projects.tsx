import React, { FunctionComponent, useRef } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Navigation from '../components/Navigation';
import Content from '../components/Content';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { useProjects } from '../lib/hooks';
import { useAppContext } from '../lib/context';
import ProjectCard from '../components/ProjectCard';
import { useScrollPosition } from '../lib/scrollPos';

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
  const { projects, loading, hasNextPage, loadMore, loadingMore } = useProjects(workspaceId, { first: 10, archived: false });
  const contentRef = useRef<HTMLDivElement>(null);
  const classes = useStyles({});
  // Don't use the scroll position hook in SSR mode
  if (typeof window !== 'undefined') {
    // Prevent calling load more too many times
    let tryLoadMore = false;
    useScrollPosition(({ currPos }) => {
      // Attempt to load more when we get to the bottom of the window
      if (contentRef.current!.clientHeight - window.innerHeight - (-currPos.y) < window.innerHeight / 2) {
        // Only load more if we have another page and are not already trying to load more
        if (hasNextPage && !loadingMore && !tryLoadMore) {
          tryLoadMore = true;
          loadMore().then(() => {
            tryLoadMore = false;
          });
        }
      }
    }, [], contentRef.current);
  }
  let content;
  if (loading) {
    content = (
      <div style={{ display: 'flex' }}>
        <CircularProgress style={{ margin: 'auto', marginTop: '20%' }}/>
      </div>
    );
  } else if (projects) {
    content = (
      <>
        <Grid container spacing={3}>
          {projects.map(project => (
            <Grid item zeroMinWidth key={project.id} xs={12} sm={12} md={6} lg={3} xl={2}>
              <ProjectCard project={project}/>
            </Grid>
          ))}
        </Grid>
        {loadingMore ? (
          <div className={classes.loadMoreContainer}>
            <CircularProgress style={{ margin: 'auto' }}/>
          </div>
        ) : hasNextPage && (
          <div className={classes.loadMoreContainer}>
            <Button 
              variant="contained"
              style={{ margin: 'auto' }} 
              onClick={loadMore}>
                Load More
              </Button>
          </div>
        )}
      </>
    );
  }
  return (
    <Navigation>
      <Content ref={contentRef}>
        {content}
      </Content>
    </Navigation>
  );
};

export default Projects;
