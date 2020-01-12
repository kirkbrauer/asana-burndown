import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { Typography, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex'
    },
    loginBox: {
      marginTop: '30vh',
      margin: 'auto',
      width: 350
    },
    loginOptions: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    },
    checkbox: {
      marginLeft: 18
    },
    textField: {
      width: '100%'
    },
    loginButtonContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%'
    },
    loginButton: {
      margin: 'auto',
      textDecoration: 'none',
      marginTop: theme.spacing(3)
    }
  })
);

const Login = () => {
  const classes = useStyles({});
  return (
    <div className={classes.container}>
      <div className={classes.loginBox}>
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          Asana Burndown Chart Generator
        </Typography>
        <Typography variant="body1" style={{ textAlign: 'center' }}>Created By Kirk Brauer</Typography>
        <div className={classes.loginButtonContainer}>
          <a href={process.env.AUTH_URL} className={classes.loginButton} style={{ textDecoration: 'none' }}>
            <Button
              color="primary"
              variant="contained"
            >
              Login with Asana
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
