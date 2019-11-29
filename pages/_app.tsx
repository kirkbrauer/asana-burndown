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
import Navigation from '../components/Navigation';

type AppProps = {
  apollo: ApolloClient<any>
  darkMode: boolean
};

type AppState = {
  workspaceId: string,
  darkMode: boolean
};

class MyApp extends App<AppProps, {}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      workspaceId: props.router.query.workspaceId,
      darkMode: props.darkMode
    };
  }

  private setDarkMode(enabled: boolean) {
    // Switch the app theme
    this.setState({ darkMode: enabled });
    // Update the user preferences
    Cookies.set('darkMode', String(enabled));
  }

  private setWorkspaceId(id: string) {
    // Update the app workspace ID
    this.setState({ workspaceId: id });
    // Update the recent workspace ID in cookies
    Cookies.set('workspaceId', id);
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    // Check if the system dark mode is enabled
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setDarkMode(true);
    } else {
      this.setDarkMode(false);
    }
  }

  render() {
    const { Component, pageProps, apollo, router } = this.props;
    const { workspaceId, darkMode } = this.state;
    let appContent;
    if (router.route !== '/login') {
      // Only wrap app components with navigation
      appContent = (
        <Navigation>
          <Component {...pageProps} />
        </Navigation>
      );
    } else {
      appContent = (
        <Component {...pageProps} />
      );
    }
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
              setWorkspaceId: id => this.setWorkspaceId(id),
              setDarkMode: enabled => this.setDarkMode(enabled)
            }}>
              <ApolloProvider client={apollo}>
                {appContent}
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
      darkMode: cookies.darkMode === 'true'
    };
  }
};

export default withApollo(MyApp);
