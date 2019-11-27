import { createMuiTheme } from '@material-ui/core/styles';
import { red, grey } from '@material-ui/core/colors';

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: red['A700']
    },
    secondary: {
      main: grey[500]
    },
  }
});

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: red['A700']
    },
    secondary: {
      main: grey[400]
    },
  },
});
