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
import CardActionArea from '@material-ui/core/CardActionArea';

type ProjectCardProps = {
  project: ProjectFragment,
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  onClickPresent?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  onClickReport?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  onClickBurndown?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  onClickOpenInAsana?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
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
      height: 200,
      position: 'relative'
    },
    projectCardContent: {
      position: 'absolute',
      top: theme.spacing(2)
    },
    projectCardActionArea: {
      position: 'absolute',
      top: 0,
      height: '100%'
    },
    projectCardActions: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      right: 0,
      left: 0,
      justifyContent: 'space-between'
    },
    projectColor: ({ projectColor }) => ({
      width: '100%',
      height: theme.spacing(2),
      backgroundColor: getColor(projectColor)
    })
  })
);

const ProjectCard: FunctionComponent<ProjectCardProps> = ({ project, onClick, onClickPresent, onClickReport, onClickBurndown, onClickOpenInAsana }) => {
  const classes = useStyles({ projectColor: project.color });
  return (
    <Card className={classes.projectCard}>
      <div className={classes.projectColor} />
      <CardActionArea className={classes.projectCardActionArea} onClick={onClick}>
        <CardContent className={classes.projectCardContent}>
          <Typography variant="h6">{project.name}</Typography>
          <Typography variant="caption"><Moment date={project.modifiedAt} fromNow/></Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.projectCardActions}>
        <Tooltip title="Present" aria-label="present" placement="top">
          <IconButton onClick={onClickPresent}>
            <SlideshowOutlinedIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Generate Report" aria-label="report" placement="top">
          <IconButton onClick={onClickReport}>
            <AssessmentOutlinedIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="View Burndown" aria-label="burndown" placement="top">
          <IconButton onClick={onClickBurndown}>
            <TrendingDownIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Open in Asana" aria-label="asana" placement="top">
          <IconButton onClick={onClickOpenInAsana}>
            <LaunchIcon/>
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
