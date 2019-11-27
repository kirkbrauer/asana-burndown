import React, { FunctionComponent } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Moment from 'react-moment';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import SlideshowOutlinedIcon from '@material-ui/icons/SlideshowOutlined';
import LaunchIcon from '@material-ui/icons/Launch';
import Typography from '@material-ui/core/Typography';
import { ProjectFragment } from '../graphql';

type ProjectCardProps = {
  project: ProjectFragment
};

const getColor = (name: string) => {
  switch (name) {
    case 'dark-red':
      return '#e8384f';
    case 'dark-orange':
      return '#fd612c';
    case 'light-orange':
      return '#fd9a00';
    case 'dark-brown':
      return '#eec300';
    case 'light-green':
      return '#a4cf30';
    case 'dark-green':
      return '#62d26f';
    case 'light-teal':
      return '#37c5ab';
    case 'dark-teal':
      return '#20aaea';
    case 'light-blue':
      return '#4186e0';
    case 'dark-purple':
      return '#7a6ff0';
    case 'light-purple':
      return '#aa62e3';
    case 'light-pink':
      return '#e362e3';
    case 'dark-pink':
      return '#ea4e9d';
    case 'light-red':
      return '#fc91ad';
    case 'light-warm-gray':
      return '#8da3a6';
    default:
      return 'lightgray';
  }
};

const useStyles = makeStyles<Theme, { projectColor: string }>((theme: Theme) =>
  createStyles({
    projectCard: {
      display: 'flex',
      flexDirection: 'column',
      height: 200
    },
    projectCardContent: {
      flex: 1
    },
    projectColor: ({ projectColor }) => ({
      width: '100%',
      height: 16,
      backgroundColor: getColor(projectColor)
    })
  })
);

const ProjectCard: FunctionComponent<ProjectCardProps> = ({ project }) => {
  const classes = useStyles({ projectColor: project.color });

  const openInAsana = () => {
    window.open(project.url, '_blank');
  };

  return (
    <Card className={classes.projectCard}>
      <div className={classes.projectColor} />
      <CardContent className={classes.projectCardContent}>
        <Typography variant="h6">{project.name}</Typography>
        <Typography variant="caption"><Moment date={project.modifiedAt} fromNow/></Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Tooltip title="Present" aria-label="present" placement="top">
          <IconButton>
            <SlideshowOutlinedIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Generate Report" aria-label="report" placement="top">
          <IconButton>
            <AssessmentOutlinedIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="View Burndown" aria-label="burndown" placement="top">
          <IconButton>
            <TrendingDownIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Open in Asana" aria-label="asana" placement="top">
          <IconButton onClick={openInAsana}>
            <LaunchIcon/>
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
