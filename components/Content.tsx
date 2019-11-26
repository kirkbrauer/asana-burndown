import React, { FunctionComponent } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      backgroundColor: theme.palette.background.default
    }
  })
);

const Content: FunctionComponent = ({ children }) => {
  const classes = useStyles({});
  return (
    <div className={classes.content}>
      <div className={classes.toolbar}/>
      {children}
    </div>
  );
};

export default Content;
