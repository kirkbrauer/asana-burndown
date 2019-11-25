import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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
  }
}));

const Login = () => {
  const classes = useStyles({});
  return (
    <div className={classes.container}>
      <div className={classes.loginBox}>
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          Asana Burndown Chart Generator
        </Typography>
        <Typography variant="body1" style={{ textAlign: 'center' }}>Created By Kirk Brauer</Typography>
        <Button 
            color="primary"
            variant="contained"
            onClick={() => {
              window.location.href = process.env.AUTH_URL!;
            }}
          >
            Login with Asana
          </Button>
      </div>
    </div>
  );
};

export default Login;
