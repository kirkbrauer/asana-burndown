import React, { FC, MouseEventHandler } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

type ProjectStatisticProps = {
  title: string;
  count: number;
  points: number;
  color: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const useStyles = makeStyles<Theme, { color: string }>(theme =>
  createStyles({
    card: {
      height: 200,
      minWidth: 325,
      display: 'flex',
      flexDirection: 'column'
    },
    container: {
      padding: theme.spacing(2),
      textAlign: 'left',
      display: 'block',
      width: '100%',
      height: '100%'
    },
    title: { 
      fontSize: '0.9rem'
    },
    content: {
      marginTop: theme.spacing(1)
    },
    taskCount: {
      marginBottom: theme.spacing(1)
    },
    colorBar: ({ color }) => ({
      height: theme.spacing(2),
      marginTop: 'auto',
      backgroundColor: color,
      width: '100%'
    })
  })
);

const ProjectStatistic: FC<ProjectStatisticProps> = ({ title, count, points, color, onClick }) => {
  const classes = useStyles({ color });
  return (
    <Card className={classes.card} onClick={onClick}>
      <ButtonBase className={classes.container}>
        <Typography variant="overline" className={classes.title}>{title}</Typography>
        <div className={classes.content}>
          <Typography variant="h3" className={classes.taskCount}>{count} Tasks</Typography>
          <Typography variant="h4">{points} Story Points</Typography>
        </div>
      </ButtonBase>
      <div className={classes.colorBar} />
    </Card>
  );
};

export default ProjectStatistic;
