import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

type ProjectCardProps = {
  // project: Project
};

const useStyles = makeStyles({

});

const ProjectCard: FunctionComponent = () => {
  const classes = useStyles({});
  return (
    <Card>
      <CardContent>
        <Typography></Typography>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
