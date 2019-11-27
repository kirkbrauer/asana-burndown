import React, { FunctionComponent, forwardRef, Ref } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';

type ContentProps = {
  disablePadding?: boolean,
  ref?: Ref<HTMLDivElement>
};

const useStyles = makeStyles<Theme, ContentProps>((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: ({ disablePadding }) => ({
      flexGrow: 1,
      padding: !disablePadding ? theme.spacing(3) : undefined,
      backgroundColor: theme.palette.background.default
    })
  })
);

const Content: FunctionComponent<ContentProps> = forwardRef<HTMLDivElement, ContentProps>(({ children, disablePadding }, ref) => {
  const classes = useStyles({ disablePadding });
  return (
    <div className={classes.content} ref={ref}>
      <div className={classes.toolbar}/>
      {children}
    </div>
  );
});

export default Content;
