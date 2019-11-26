import { createMuiTheme } from '@material-ui/core/styles';

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#bb0000'
    },
    secondary: {
      main: '#666666'
    },
  }
});

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#bb0000'
    },
    secondary: {
      main: '#666666'
    },
  },
});
