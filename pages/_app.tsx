import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { lightTheme, darkTheme } from '../lib/theme';
import withApollo from '../lib/apollo';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { RouterProvider } from 'use-next-route';
import { AppContextProvider } from '../lib/context';
import Cookies from 'js-cookie';
import cookie from 'cookie';

type AppProps = {
  apollo: ApolloClient<any>
  darkMode: boolean,
  workspaceId: string
};

type AppState = {
  workspaceId: string,
  darkMode: boolean
};

class MyApp extends App<AppProps, {}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      workspaceId: props.router.query.workspaceId || props.workspaceId,
      darkMode: props.darkMode
    };
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, apollo, router } = this.props;
    const { workspaceId, darkMode } = this.state;
    return (
      <React.Fragment>
        <Head>
          <title>Asana Burndown Chart</title>
        </Head>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <RouterProvider route={router.route}>
            <AppContextProvider value={{
              workspaceId,
              darkMode,
              setWorkspaceId: (id) => {
                // Update the app workspace ID
                this.setState({ workspaceId: id });
                // Update the recent workspace ID in cookies
                Cookies.set('workspaceId', id);
              },
              setDarkMode: (enabled) => {
                // Switch the app theme
                this.setState({ darkMode: enabled });
                // Update the user preferences
                Cookies.set('darkMode', String(enabled));
              }
            }}>
              <ApolloProvider client={apollo}>
                <Component {...pageProps} />
              </ApolloProvider>
            </AppContextProvider>
          </RouterProvider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  if (ctx.req) {
    const cookies = (ctx.req as any).cookies;
    return {
      pageProps: {},
      darkMode: cookies.darkMode === 'true',
      workspaceId: cookies.workspaceId
    };
  }
};

export default withApollo(MyApp);
